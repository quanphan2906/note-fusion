import { NextRequest, NextResponse } from "next/server";
import { indexQuery } from "@/app/api/pineconeClient";

export async function POST(req: NextRequest) {
	const { ids, throwIfNotFound } = await req.json();

	try {
		await indexQuery.deleteMany(ids);
		return NextResponse.json({
			status: "OK",
			message: "Vectors deleted successfully",
		});
	} catch (error) {
		if (throwIfNotFound) {
			return NextResponse.json(
				{ status: "ERROR", message: "Failed to delete vectors" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			status: "OK",
			message: "Vectors deleted successfully",
		});
	}
}
