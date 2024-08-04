import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int(),
  DATABASE_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
