import { client } from "@/app/api/pineconeClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { texts } = await req.json();

		const response = await client.inference.embed("multilingual-e5-large", texts, {
			inputType: "passage",
			truncate: "END",
		});

		return NextResponse.json(response.data);
	} catch (error) {
		console.log("error in embedding", error);
		return NextResponse.json(
			{ status: "ERROR", message: "Failed to generate embeddings" },
			{ status: 500 },
		);
	}
}
