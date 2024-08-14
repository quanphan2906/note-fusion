import { NextRequest, NextResponse } from "next/server";
import { vectorSearch } from "@/dao/pinecone-access-service-v2";

export async function POST(req: NextRequest) {
	try {
		const { index, queryVector, topK, includeMetadata, filter } = await req.json();
		const result = await vectorSearch(index, {
			queryVector,
			topK,
			includeMetadata,
			filter,
		});
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to conduct vector search" },
			{ status: 500 },
		);
	}
}
