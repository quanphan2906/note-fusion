import { PineconeIndexes } from "@/common/types/Pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY || "";

const client = new Pinecone({
	apiKey: apiKey,
});

export const PineconeIndexQuery = {
	[PineconeIndexes.Blocks]: client.Index(PineconeIndexes.Blocks),
};
