import {
	PineconeAccessService,
	PineconeAccessServiceActions,
	PineconeServiceArgs,
} from "@/access-services/pinecone-access-service";
import { NextResponse } from "next/server";

export function isSaveEmbeddingsArgs(
	args: unknown[],
): args is PineconeServiceArgs<"saveEmbeddings"> {
	return true;
}

export async function POST(request: Request) {
	try {
		const { functionName, args } = (await request.json()) as {
			functionName: PineconeAccessServiceActions;
			args: unknown[];
		};

		const func = PineconeAccessService[functionName];
		if (!func) {
			return NextResponse.json(
				{ status: "ERROR", message: "Function not found" },
				{ status: 400 },
			);
		}

		let result;

		if (functionName === "saveEmbeddings" && isSaveEmbeddingsArgs(args)) {
			result = await func(...args);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error executing function:", error);
		return NextResponse.json(
			{ status: "ERROR", message: "Error executing function" },
			{ status: 500 },
		);
	}
}
