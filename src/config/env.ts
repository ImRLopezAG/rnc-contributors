import { z } from 'zod';
const { ...processEnv } = process.env;

export const env = () => z.object({
  DATABASE_URL: z.string().default('file:./src/server/db/data.db'),
  DB_AUTH_TOKEN: z.string().default(''),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
}).parse(processEnv);