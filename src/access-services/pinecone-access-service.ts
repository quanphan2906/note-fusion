/**
 * Pinecone Node.js client was designed to run on a Node.js environment
 * not the browser. Therefore, I expose the following access services through
 * Next.js Route Handler. See ~/src/app/api/pinecone
 */

import { Pinecone } from "@pinecone-database/pinecone";
import {
	PineconeIndexes,
	PineconeMetaData,
	PineconeSearchResult,
	Vector,
	Embedding,
} from "@/common/types/Pinecone";
import { ServiceResult } from "@/common/types/ServiceResult";

const apiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY || "";

const client = new Pinecone({
	apiKey: apiKey,
});

const PineconeIndexQuery = {
	[PineconeIndexes.Blocks]: client.Index(PineconeIndexes.Blocks),
};

const saveEmbeddings = async <I extends PineconeIndexes>(
	index: I,
	embeddings: Embedding<I>[],
): Promise<ServiceResult<void>> => {
	const indexQuery = PineconeIndexQuery[index];
	try {
		await indexQuery.upsert(embeddings);
		return {
			status: "OK",
			message: "Embedding saved successfully",
		};
	} catch (error) {
		console.error("Error saving embedding:", error);
		return {
			status: "ERROR",
			message: "Error saving embedding",
		};
	}
};

const vectorSearch = async <I extends PineconeIndexes>(
	index: I,
	{
		queryVector,
		topK = 10,
		includeMetadata = true,
		filter = {},
	}: {
		queryVector: Vector;
		topK?: number;
		includeMetadata?: boolean;
		filter?: Partial<PineconeMetaData[I]>;
	},
): Promise<ServiceResult<PineconeSearchResult<I>[]>> => {
	const indexQuery = PineconeIndexQuery[index];
	try {
		const result = await indexQuery.query({
			vector: queryVector,
			topK: topK,
			includeMetadata,
			filter,
		});

		return {
			status: "OK",
			data: result.matches as PineconeSearchResult<I>[],
			message: "Search completed successfully",
		};
	} catch (error) {
		console.error("Error conducting vector search:", error);
		return {
			status: "ERROR",
			message: "Error conducting vector search",
		};
	}
};

const deleteVectors = async <I extends PineconeIndexes>(
	index: I,
	ids: string[],
): Promise<void> => {
	const indexQuery = PineconeIndexQuery[index];
	await indexQuery.deleteMany(ids);
};

export const PineconeAccessService = {
	saveEmbeddings,
	vectorSearch,
	deleteVectors,
} as const;

export type PineconeAccessServiceActions = keyof typeof PineconeAccessService;
export type PineconeServiceArgs<T extends PineconeAccessServiceActions> = Parameters<
	(typeof PineconeAccessService)[T]
>;
