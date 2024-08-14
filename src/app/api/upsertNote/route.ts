import { upsertNote } from "@/dao/pinecone-access-service-v2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { noteId, noteTitle, blocks } = await req.json();
		const result = await upsertNote(noteId, noteTitle, blocks);
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to upsert note" },
			{ status: 500 },
		);
	}
}
