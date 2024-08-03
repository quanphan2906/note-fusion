import {
	DUMMY_TOPK_TO_QUERY_WITH_METADATA,
	Embedding,
	PineconeIndexes,
	PineconeMetaData,
	PineconeSearchResult,
	Vector,
	VECTOR_DIMENSIONS,
} from "@/common/types/Pinecone";
import { PineconeIndexQuery } from "./pineconeConfig";
import { ServiceResult } from "@/common/types/ServiceResult";
import { map, times } from "lodash";
import { v4 as uuidv4 } from "uuid";

// Save vector embeddings to Pinecone
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

// Conduct a vector search against Pinecone
export const vectorSearch = async <I extends PineconeIndexes>(
	index: I,
	{
		queryVector,
		topK,
		includeMetadata,
		filter,
	}: {
		queryVector: Vector;
		topK: number;
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

export const deleteVectors = async <I extends PineconeIndexes>(
	index: I,
	ids: string[],
): Promise<void> => {
	const indexQuery = PineconeIndexQuery[index];
	await indexQuery.deleteMany(ids);
};

// TODO: How to generate embeddings in TS?
const generateEmbedding = (text: string): Vector => {
	return [];
};

export const upsertNote = async (noteId: string, blocks: string[]) => {
	await deleteNote(noteId);
	// generate embeddings from blocks
	const embeddings = blocks.map((block) => ({
		id: uuidv4(),
		values: generateEmbedding(block),
		metadata: {
			noteId,
			content: block,
		},
	}));

	await saveEmbeddings(PineconeIndexes.Blocks, embeddings);
};

export const deleteNote = async (noteId: string) => {
	const results = await vectorSearch(PineconeIndexes.Blocks, {
		queryVector: times(VECTOR_DIMENSIONS, () => 0),
		topK: DUMMY_TOPK_TO_QUERY_WITH_METADATA,
		includeMetadata: true,
		filter: { noteId },
	});

	const idsToDelete = map(results.data, (match) => match.id);
	await deleteVectors(PineconeIndexes.Blocks, idsToDelete);
};
