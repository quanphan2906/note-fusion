import { Note } from "@/common/types/Note";

export enum FirestoreCollection {
	Notes = "notes",
}

export interface FirestoreCollectionDataType {
	[FirestoreCollection.Notes]: Note;
}
