import { Vector } from "@/common/types/Pinecone";
import { openai } from "./openAIConfig";
import { map } from "lodash";

const DEFAULT_EMBEDDING_MODEL = "text-embedding-ada-002";

export const generateEmbeddings = async (
	texts: string[],
	embedding_model: string = DEFAULT_EMBEDDING_MODEL,
): Promise<Vector[]> => {
	const response = await openai.embeddings.create({
		model: embedding_model,
		input: texts,
	});

	const embeddings = map(response.data, (embeddingObject) => embeddingObject.embedding);

	return embeddings;
};
