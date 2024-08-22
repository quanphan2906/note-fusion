import { indexQuery } from "@/app/api/pineconeClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { vectors } = await req.json();
		console.log("upserting the vector!", vectors);
		await indexQuery.upsert(vectors);
		console.log("upserted the vector!");
		return NextResponse.json({
			status: "OK",
			message: "Successfully saved the vectors",
		});
	} catch (error) {
		console.log("error in upserting", error);
		return NextResponse.json({ status: "ERROR", message: error }, { status: 500 });
	}
}
