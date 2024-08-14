import { NextRequest, NextResponse } from "next/server";
import { deleteVectors } from "@/dao/pinecone-access-service";

export async function POST(req: NextRequest) {
	try {
		const { index, ids } = await req.json();
		await deleteVectors(index, ids);
		return NextResponse.json({ status: "OK", message: "Vectors deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to delete vectors" },
			{ status: 500 },
		);
	}
}
