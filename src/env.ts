import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_HOST: z.string(),
  AWS_BUCKET_NAME: z.string(),
  INTERNAL_API_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_TOKEN_AUDIENCE: z.string(),
  JWT_TOKEN_ISSUER: z.string(),
});

export type Env = z.infer<typeof envSchema>;
