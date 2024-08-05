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
import { generateEmbeddings } from "../common/utils/generateEmbeddings";
import { Suggestion } from "@/common/types/Suggestion";
import {
	createDocument,
	updateDocument,
} from "@/access-services/firebase-access-service";
import { FirestoreCollection } from "@/common/types/Firestore";
import { Note } from "@/common/types/Note";

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

	// call to pinecone using api/pinecone
	// use extractTextFromBlocks util to extract the block and send to Pinecone
	// const newBlocksText = newBlocks ? extractTextFromBlocks(newBlocks) : undefined;
	// add the api function to upsert to pinecone into the Promise all array below
};

export const getNote = () => {
	// call to fb using fb-access-service
	// call to pinecone using api/pinecone
};

export const getAllNotes = () => {
	// call to fb using fb-access-service
};

export const deleteNote = () => {
	// call to fb using fb-access-service
	// call to pinecone using api/pinecone
};

// export const upsertNote = async (noteId: string, noteTitle: string, blocks: string[]) => {
// 	await deleteNote(noteId);

// 	const embeddingValues = await generateEmbeddings(blocks);

// 	const embeddings = blocks.map((block, blockIndex) => ({
// 		id: uuidv4(),
// 		values: embeddingValues[blockIndex],
// 		metadata: {
// 			noteId,
// 			noteTitle,
// 			content: block,
// 		},
// 	}));

// 	return await saveEmbeddings(PineconeIndexes.Blocks, embeddings);
// };

// export const deleteNote = async (noteId: string) => {
// 	const results = await vectorSearch(PineconeIndexes.Blocks, {
// 		queryVector: times(VECTOR_DIMENSIONS, () => 0),
// 		topK: DUMMY_TOPK_TO_QUERY_WITH_METADATA,
// 		includeMetadata: true,
// 		filter: { noteId },
// 	});

// 	const idsToDelete = map(results.data, (match) => match.id);
// 	return await deleteVectors(PineconeIndexes.Blocks, idsToDelete);
// };

// export const searchForRelevantBlocks = async (text: string): Promise<Suggestion[]> => {
// 	const embeddingValues = await generateEmbeddings([text]);
// 	const queryVector = embeddingValues[0]!;
// 	const res = await vectorSearch(PineconeIndexes.Blocks, {
// 		queryVector,
// 	});

// 	const suggestionsWithUndefined = map(res.data, (result) => result.metadata);
// 	const suggestions = compact(suggestionsWithUndefined);
// 	return suggestions;
// };
