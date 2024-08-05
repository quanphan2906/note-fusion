import axios from "axios";

export const pineconeAxios = axios.create({
	headers: {
		"Content-Type": "application/json",
		"Api-Key": process.env.NEXT_PUBLIC_PINECONE_API_KEY,
		"X-Pinecone-API-Version": "2024-07",
	},
});
