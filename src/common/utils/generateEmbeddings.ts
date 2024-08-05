import { Vector } from "@/common/types/Pinecone";
import { map } from "lodash";
import { OpenAI } from "openai";

const DEFAULT_EMBEDDING_MODEL = "text-embedding-ada-002";

export const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const generateEmbeddings = async (
	texts: string[],
	embedding_model: string = DEFAULT_EMBEDDING_MODEL,
): Promise<number[][]> => {
	const response = await openai.embeddings.create({
		model: embedding_model,
		input: texts,
	});

	const embeddings = map(response.data, (embeddingObject) => embeddingObject.embedding);

	return embeddings;
};
