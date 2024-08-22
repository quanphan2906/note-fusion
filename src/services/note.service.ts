import {
	DUMMY_TOPK_TO_QUERY_WITH_METADATA,
	VECTOR_DIMENSIONS,
} from "@/dao/pinecone.config";
import { createServiceResult, ServiceResult } from "@/common/types/ServiceResult";
import { compact, isArray, isEmpty, isNil, map, times } from "lodash";
import { Suggestion } from "@/common/types/Suggestion";
import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	getDocument,
	updateDocument,
} from "@/dao/firebase.service";
import { FirestoreCollection } from "@/common/types/Firestore";
import { Note } from "@/common/types/Note";
import {
	deleteVectors,
	upsertVectors,
	queryVectors,
	generateEmbeddings,
} from "@/dao/pinecone.service";
import { Block } from "@blocknote/core";

export const createNote = async () => {
	const emptyNote = {
		title: "",
		content: [],
	};
	const queryResult = await createDocument(FirestoreCollection.Notes, emptyNote);
	return queryResult;
};

export const getAllNotes = async () => {
	const queryResult = await getAllDocuments(FirestoreCollection.Notes);
	return queryResult;
};

export const searchForRelevantBlocks = async (text: string): Promise<Suggestion[]> => {
	const embeddingValues = await generateEmbeddings([text]);
	const queryVector = embeddingValues[0]!;
	const res = await queryVectors({
		queryVector,
	});

	const suggestionsWithUndefined = map(res, (result) => result.metadata);
	const suggestions = compact(suggestionsWithUndefined);
	return suggestions;
};

const pineconeUpsertNote = async (noteId: string, noteTitle: string, blocks: Block[]) => {
	const textsWithUndefined = map(blocks, (block) =>
		isArray(block.content) && !isEmpty(block.content)
			? (block.content[0] as { text: string }).text
			: undefined,
	);

	const texts = compact(textsWithUndefined);

	console.log("all the texts", texts);

	const embeddingValues = await generateEmbeddings(texts);

	const embeddingsWithNull = map(blocks, (block, blockIndex) => {
		if (isNil(embeddingValues[blockIndex])) {
			return null;
		}

		return {
			id: block.id,
			values: embeddingValues[blockIndex],
			metadata: {
				noteId,
				noteTitle,
				content: texts[blockIndex],
			},
		};
	});

	const embeddings = compact(embeddingsWithNull);

	console.log("all the embeddings", embeddings);

	return await upsertVectors(embeddings);
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

	console.log("Hey made the call to Firebase!");

	// ideally, we'd want to compare blocks at all levels and update
	// but for PoC, we will only work with top level blocks.
	// 1. Delete all current top level blocks
	// 2. Upsert new
	const idsOfBlocksToDelete = map(topLevelBlocks, (b) => b.id);
	await deleteVectors(idsOfBlocksToDelete);
	await pineconeUpsertNote(noteId, noteTitle, topLevelBlocks ?? []); // extract from block to content

	console.log("Made the call to Pinecone!");

	// TODO: I think this is where the "always return error" gets funky
	// When you're making calls to so many service functions, try catch allows you to catch the error once
	// Now you just have to name everything??

	return createServiceResult("OK");
};

export const deleteNote = async (id: string) => {
	const fbQueryResult = await deleteDocument(FirestoreCollection.Notes, id);
	if (fbQueryResult.status === "ERROR") return fbQueryResult;

	const results = await queryVectors({
		queryVector: times(VECTOR_DIMENSIONS, () => 0),
		topK: DUMMY_TOPK_TO_QUERY_WITH_METADATA,
		includeMetadata: true,
		filter: { noteId: id },
	});

	const idsToDelete = map(results, (match) => match.id);
	await deleteVectors(idsToDelete);

	return createServiceResult<undefined>("OK");
};
