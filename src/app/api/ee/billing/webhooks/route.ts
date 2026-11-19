import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk"


export async function POST(request: NextRequest) {
    try {
        // Get the raw request body
        const rawBody = await request.text()
        const signature = request.headers.get("paddle-signature")

        if (!signature) {
            return NextResponse.json(
                { error: "No signature provided" },
                { status: 401 }
            )
        }

        const secret = process.env.PADDLE_WEBHOOK_SECRET

        if (!secret) {
            return NextResponse.json(
                { error: "No secret provided" },
                { status: 500 }
            )
        }

        const paddle = new Paddle(process.env.PADDLE_CLIENT_SECRET || "", {
            environment: process.env.PADDLE_MODE === "production" ? Environment.production : Environment.sandbox
        })

        const event = await paddle.webhooks.unmarshal(rawBody, secret, signature)

        if (!event) {
            return NextResponse.json(
                { error: "Invalid event" },
                { status: 400 }
            )
        }

        if (event && (event.eventType === EventName.TransactionCompleted)) {
            const customerId = event.data.customerId || ""
            const priceId = event.data.items[0].price?.id || ""

            const billing = await prisma.billing.findFirstOrThrow({
                where: {
                    thirdPartyId: customerId
                }
            })

            if (billing.subscriptionId && billing.subscriptionId !== event.data.subscriptionId) {
                await paddle.subscriptions.cancel(billing.subscriptionId, { effectiveFrom: "immediately" })
            }

            // Paddle redelivers events. Claim the event id and grant in one transaction,
            // so a second delivery of the same event adds nothing.
            await prisma.$transaction(async (tx) => {
                const claimed = await tx.$executeRaw`INSERT INTO "ProcessedWebhookEvent" (id) VALUES (${event.eventId}) ON CONFLICT DO NOTHING`
                if (claimed === 0) return

                // Handle Pro Plan
                if (priceId === process.env.PRO_PLAN_PRICE_ID_MONTHLY || priceId === process.env.PRO_PLAN_PRICE_ID_YEARLY) {
                    await tx.billing.update({
                        where: {
                            organizationId: billing.organizationId
                        },
                        data: {
                            plan: "PRO",
                            credits: {
                                increment: parseInt(process.env.PRO_PLAN_CREDITS || "0")
                            },
                            subscriptionId: event.data.subscriptionId,
                            expiresAt: new Date(event.data.billingPeriod?.endsAt || "")
                        }
                    })
                }

                // Handle Additional Credits
                if (priceId === process.env.ADDITIONAL_CREDITS_PRICE_ID) {
                    await tx.billing.update({
                        where: {
                            organizationId: billing.organizationId
                        },
                        data: {
                            credits: {
                                increment: parseInt(process.env.ADDITIONAL_CREDITS_QTY || "0")
                            }
                        }
                    })
                }
            })
        }

        if (event && (event.eventType === EventName.SubscriptionCanceled || event.eventType === EventName.SubscriptionPastDue)) {
            const customerId = event.data.customerId
            const planId = event.data.items[0].price?.id

            await prisma.billing.updateMany({
                where: {
                    thirdPartyId: customerId
                },
                data: {
                    plan: "FREE",
                    subscriptionId: planId,
                }
            })
        }

        return NextResponse.json("ok")

    } catch (error) {
        console.error("Webhook error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}