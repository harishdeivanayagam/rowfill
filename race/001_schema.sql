-- Minimal DDL mirroring the tables the webhook writes to (with this change applied).
CREATE TABLE "Billing"("organizationId" text PRIMARY KEY,credits int NOT NULL DEFAULT 1000);
CREATE TABLE "ProcessedWebhookEvent"(id text PRIMARY KEY,"createdAt" timestamptz NOT NULL DEFAULT now());
