import { z } from 'zod';

export const messageRequestSchema = z.object({
	message: z.string(),
	to: z.string(),
});
