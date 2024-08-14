import { searchForRelevantBlocks } from "@/dao/pinecone-access-service-v2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { text } = await req.json();
		const suggestions = await searchForRelevantBlocks(text);
		return NextResponse.json(suggestions);
	} catch (error) {
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to search for relevant blocks" },
			{ status: 500 },
		);
	}
}
