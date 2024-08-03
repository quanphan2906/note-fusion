import { OpenAI } from "openai";

const configuration = {
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
};

export const openai = new OpenAI(configuration);
