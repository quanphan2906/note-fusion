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
import { compact, map, times } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { generateEmbeddings } from "./generateEmbeddings";
import { Suggestion } from "@/common/types/Suggestion";

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

export const deleteVectors = async <I extends PineconeIndexes>(
	index: I,
	ids: string[],
): Promise<void> => {
	const indexQuery = PineconeIndexQuery[index];
	await indexQuery.deleteMany(ids);
};

export const upsertNote = async (noteId: string, noteTitle: string, blocks: string[]) => {
	await deleteNote(noteId);

	const embeddingValues = await generateEmbeddings(blocks);

	const embeddings = blocks.map((block, blockIndex) => ({
		id: uuidv4(),
		values: embeddingValues[blockIndex],
		metadata: {
			noteId,
			noteTitle,
			content: block,
		},
	}));

	return await saveEmbeddings(PineconeIndexes.Blocks, embeddings);
};

export const deleteNote = async (noteId: string) => {
	const results = await vectorSearch(PineconeIndexes.Blocks, {
		queryVector: times(VECTOR_DIMENSIONS, () => 0),
		topK: DUMMY_TOPK_TO_QUERY_WITH_METADATA,
		includeMetadata: true,
		filter: { noteId },
	});

	const idsToDelete = map(results.data, (match) => match.id);
	return await deleteVectors(PineconeIndexes.Blocks, idsToDelete);
};

export const searchForRelevantBlocks = async (text: string): Promise<Suggestion[]> => {
	const embeddingValues = await generateEmbeddings([text]);
	const queryVector = embeddingValues[0]!;
	const res = await vectorSearch(PineconeIndexes.Blocks, {
		queryVector,
	});

	const suggestionsWithUndefined = map(res.data, (result) => result.metadata);
	const suggestions = compact(suggestionsWithUndefined);
	return suggestions;
};
