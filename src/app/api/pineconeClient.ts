import { indexName } from "@/dao/pinecone.config";
import { Pinecone } from "@pinecone-database/pinecone";

export const client = new Pinecone({
	apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || "",
});

export const indexQuery = client.Index(indexName);
