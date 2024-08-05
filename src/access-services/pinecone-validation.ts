import { z } from "zod";

export const IndexDescriptionSchema = z.object({
	name: z.string(),
	dimension: z.number(),
	host: z.string(),
});

export const VectorSearchSchema = z.object({
	matches: z.array(
		z.object({
			id: z.string(),
			score: z.number(),
			values: z.array(z.number()),
			// TODO: how to validate metadata?
		}),
	),
});
