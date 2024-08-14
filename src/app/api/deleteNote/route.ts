import { deleteNote } from "@/dao/pinecone-access-service-v2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { noteId } = await req.json();
		await deleteNote(noteId);
		return NextResponse.json({ status: "OK", message: "Note deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to delete note" },
			{ status: 500 },
		);
	}
}
