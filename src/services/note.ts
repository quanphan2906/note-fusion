import {
	DUMMY_TOPK_TO_QUERY_WITH_METADATA,
	PineconeIndexes,
	VECTOR_DIMENSIONS,
} from "@/common/types/Pinecone";
import { createServiceResult, ServiceResult } from "@/common/types/ServiceResult";
import { compact, map, times } from "lodash";
import { generateEmbeddings } from "../common/utils/generateEmbeddings";
import { Suggestion } from "@/common/types/Suggestion";
import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	getDocument,
	updateDocument,
} from "@/access-services/firebase-access-service";
import { FirestoreCollection } from "@/common/types/Firestore";
import { Note } from "@/common/types/Note";
import {
	deleteVectors,
	upsertVectors,
	vectorSearch,
} from "@/access-services/pinecone-access-service-v2";
import { Block } from "@blocknote/core";

export const createNote = async () => {
	const emptyNote = {
		title: "",
		content: [],
	};
	const queryResult = await createDocument(FirestoreCollection.Notes, emptyNote);
	return queryResult;
};

export const updateNote = async (
	noteId: string,
	noteChanges: Partial<Omit<Note, "id">>,
): Promise<ServiceResult<void>> => {
	const queryResult = await updateDocument(
		FirestoreCollection.Notes,
		noteId,
		noteChanges,
	);
	if (queryResult.status !== "OK") return queryResult;

	const { content: topLevelBlocks } = noteChanges;

	const docResponse = await getDocument(FirestoreCollection.Notes, noteId);
	if (docResponse.status === "ERROR" || docResponse.data === undefined)
		return createServiceResult(docResponse.status, docResponse.message);
	const noteTitle = docResponse.data.title;

	// ideally, we'd want to compare blocks at all levels and update
	// but for PoC, we will only work with top level blocks.
	// 1. Delete all current top level blocks
	// 2. Upsert new
	const idsOfBlocksToDelete = map(topLevelBlocks, (b) => b.id);
	await deleteVectors(PineconeIndexes.Blocks, idsOfBlocksToDelete);
	await pineconeUpsertNote(noteId, noteTitle, topLevelBlocks ?? []); // extract from block to content

	// TODO: I think this is where the "always return error" gets funky
	// When you're making calls to so many service functions, try catch allows you to catch the error once
	// Now you just have to name everything??

	return createServiceResult("OK");
};

export const getAllNotes = async () => {
	const queryResult = await getAllDocuments(FirestoreCollection.Notes);
	return queryResult;
};

export const deleteNote = async (id: string) => {
	const fbQueryResult = await deleteDocument(FirestoreCollection.Notes, id);
	if (fbQueryResult.status === "ERROR") return fbQueryResult;

	const pineconeQueryResult = await pineconeDeleteNote(id);
	if (pineconeQueryResult.status === "ERROR") return pineconeQueryResult;

	return createServiceResult("OK");
};

export const pineconeUpsertNote = async (
	noteId: string,
	noteTitle: string,
	blocks: Block[],
) => {
	// const contents = extractContentFromBlocks(blocks)
	const contents: string[] = [];

	const embeddingValues = await generateEmbeddings(contents);

	const embeddings = blocks.map((block, blockIndex) => ({
		id: block.id,
		values: embeddingValues[blockIndex],
		metadata: {
			noteId,
			noteTitle,
			content: contents[blockIndex],
		},
	}));

	return await upsertVectors(PineconeIndexes.Blocks, embeddings);
};

export const pineconeDeleteNote = async (noteId: string) => {
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
