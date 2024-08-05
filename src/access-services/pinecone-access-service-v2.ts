import {
	PineconeIndexes,
	PineconeMetaData,
	PineconeSearchResult,
	Vector,
} from "@/common/types/Pinecone";
import { createServiceResult, ServiceResult } from "@/common/types/ServiceResult";
import { pineconeAxios } from "./pineconeAxios";
import { IndexDescriptionSchema, VectorSearchSchema } from "./pinecone-validation";

const getIndexHost = async (indexName: PineconeIndexes) => {
	const response = await pineconeAxios({
		method: "get",
		url: `https://api.pinecone.io/${indexName}`,
	});

	const parsedData = IndexDescriptionSchema.parse(response.data);

	return parsedData.host;
};

export const upsertVectors = async <I extends PineconeIndexes>(
	index: I,
	vectors: Vector<I>[],
) => {
	try {
		const indexHost = await getIndexHost(index);
		await pineconeAxios({
			method: "post",
			url: `https://${indexHost}/vectors/upsert`,
			data: { vectors },
		});

		return createServiceResult("OK");
	} catch (err) {
		const error = err as Error;
		return createServiceResult("ERROR", "Error upserting vectors: " + error.message);
	}
};

export const vectorSearch = async <I extends PineconeIndexes>(
	index: I,
	{
		queryVector,
		topK = 10,
		includeMetadata = true,
		filter = {},
	}: {
		queryVector: Array<number>;
		topK?: number;
		includeMetadata?: boolean;
		filter?: Partial<PineconeMetaData[I]>;
	},
): Promise<ServiceResult<PineconeSearchResult<I>[]>> => {
	try {
		const indexHost = await getIndexHost(index);

		const result = await pineconeAxios({
			method: "post",
			url: `https://${indexHost}/query`,
			data: {
				vector: queryVector,
				topK: topK,
				includeMetadata,
				filter,
			},
		});

		const data = VectorSearchSchema.parse(result.data);

		return createServiceResult(
			"OK",
			undefined,
			data.matches as PineconeSearchResult<I>[],
		);
	} catch (err) {
		const error = err as Error;
		return createServiceResult("ERROR", `Error searching vectors: ${error.message}`);
	}
};

export const deleteVectors = async <I extends PineconeIndexes>(
	index: I,
	ids: string[],
): Promise<ServiceResult<void>> => {
	try {
		const indexHost = await getIndexHost(index);
		await pineconeAxios({
			method: "post",
			url: `https://${indexHost}/vectors/delete`,
			data: { ids },
		});

		return createServiceResult("OK");
	} catch (err) {
		const error = err as Error;
		return createServiceResult("ERROR", "Error upserting vectors: " + error.message);
	}
};
