import {
	DUMMY_TOPK_TO_QUERY_WITH_METADATA,
	VECTOR_DIMENSIONS,
} from "@/dao/pinecone.config";
import { compact, isArray, isEmpty, isNil, map, size, times } from "lodash";
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
	const newNote = await createDocument(FirestoreCollection.Notes, emptyNote);
	return newNote;
};

export const getAllNotes = async () => {
	const allNotes = await getAllDocuments(FirestoreCollection.Notes);
	return allNotes;
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

	const embeddingValues = await generateEmbeddings(texts);

	if (size(embeddingValues) === 0) return;

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

	return await upsertVectors(embeddings);
};

export const updateNote = async (
	noteId: string,
	noteChanges: Partial<Omit<Note, "id">>,
): Promise<void> => {
	await updateDocument(FirestoreCollection.Notes, noteId, noteChanges);

	const { content: topLevelBlocks } = noteChanges;

	const note = await getDocument(FirestoreCollection.Notes, noteId);
	const noteTitle = note?.title || "";

	console.log("Hey made the call to Firebase!");

	// ideally, we'd want to compare blocks at all levels and update
	// but for PoC, we will only work with top level blocks.
	// 1. Delete all current top level blocks
	// 2. Upsert new
	const idsOfBlocksToDelete = map(topLevelBlocks, (b) => b.id);
	await deleteVectors(idsOfBlocksToDelete);
	await pineconeUpsertNote(noteId, noteTitle, topLevelBlocks ?? []); // extract from block to content

	console.log("Made the call to Pinecone!");
};

export const deleteNote = async (id: string) => {
	await deleteDocument(FirestoreCollection.Notes, id);

	const results = await queryVectors({
		queryVector: times(VECTOR_DIMENSIONS, () => 0),
		topK: DUMMY_TOPK_TO_QUERY_WITH_METADATA,
		includeMetadata: true,
		filter: { noteId: id },
	});

	const idsToDelete = map(results, (match) => match.id);
	await deleteVectors(idsToDelete);
};
