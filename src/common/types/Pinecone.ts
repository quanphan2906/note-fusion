import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { Suggestion } from "./Suggestion";

export enum PineconeIndexes {
	Blocks = "blocks",
}

export interface PineconeMetaData {
	[PineconeIndexes.Blocks]: Suggestion;
}

export type Vector<I extends PineconeIndexes> = {
	id: string;
	values: number[];
	metadata: PineconeMetaData[I];
};

export type PineconeSearchResult<I extends PineconeIndexes> = ScoredPineconeRecord<
	PineconeMetaData[I]
>;

export const VECTOR_DIMENSIONS = 384;
export const DUMMY_TOPK_TO_QUERY_WITH_METADATA = 10000;
