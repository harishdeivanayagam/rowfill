import weaviate, { WeaviateClient } from "weaviate-client"

// Identifies Rowfill traffic to Weaviate (read by Weaviate >= 1.38 on REST and gRPC).
const integrationHeaders = {
    "X-Weaviate-Client-Integration": `rowfill/${process.env.npm_package_version || "unknown"}`
}

export async function getWeaviateClient(): Promise<WeaviateClient> {
    const url = process.env.WEAVIATE_URL || ""
    const apiKey = process.env.WEAVIATE_API_KEY || ""
    const localUrl = process.env.WEAVIATE_LOCAL_URL || ""

    if (localUrl) {
        return await weaviate.connectToLocal({
            host: localUrl.split(":")[0],
            port: parseInt(localUrl.split(":")[1]),
            headers: integrationHeaders
        })
    }

    return await weaviate.connectToWeaviateCloud(url, {
        authCredentials: new weaviate.ApiKey(apiKey),
        headers: integrationHeaders
    })
}
