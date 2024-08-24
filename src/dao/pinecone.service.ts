import axios from "axios";
import {
	EmbeddingsList,
	PineconeRecord,
	ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { Suggestion } from "@/common/types/Suggestion";
import { z } from "zod";
import { map } from "lodash";
import { metadata } from "@/app/layout";

export const upsertVectors = async (vectors: PineconeRecord<Suggestion>[]) => {
	await axios({
		method: "post",
		url: `api/vectors/upsert`,
		data: { vectors },
	});
};

export const queryVectors = async ({
	queryVector,
	topK = 10,
	includeMetadata = true,
	filter = {},
}: {
	queryVector: Array<number>;
	topK?: number;
	includeMetadata?: boolean;
	filter?: Partial<Suggestion>;
}): Promise<ScoredPineconeRecord<Suggestion>[]> => {
	const result = await axios({
		method: "post",
		url: `api/vectors/query`,
		data: {
			vector: queryVector,
			topK: topK,
			includeMetadata,
			filter,
		},
	});

	return result.data as ScoredPineconeRecord<Suggestion>[];
};

export const deleteVectors = async (
	ids: string[],
	throwIfNotFound: boolean = false,
): Promise<void> => {
	await axios({
		method: "post",
		url: `api/vectors/delete`,
		data: { ids, throwIfNotFound },
	});
};

export const generateEmbeddings = async (
	texts: string[],
): Promise<(Array<number> | undefined)[]> => {
	const response = (await axios({
		method: "post",
		url: `api/vectors/embed`,
		data: {
			model: "multilingual-e5-large",
			texts,
		},
	})) as EmbeddingsList;

	return map(response.data, (embedding) => embedding.values);
};
