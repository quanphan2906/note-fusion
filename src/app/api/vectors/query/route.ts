import { NextRequest, NextResponse } from "next/server";
import { indexQuery } from "@/app/api/pineconeClient";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { Suggestion } from "@/common/types/Suggestion";

export async function POST(req: NextRequest) {
	try {
		const { vector, topK, includeMetadata, filter } = await req.json();
		const result = await indexQuery.query({
			vector,
			topK: topK,
			includeMetadata,
			filter,
		});

		return NextResponse.json(result.matches as ScoredPineconeRecord<Suggestion>[]);
	} catch (error) {
		console.log("error", error);
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to conduct vector search" },
			{ status: 500 },
		);
	}
}
