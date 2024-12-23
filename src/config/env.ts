import { z } from 'zod';
const { ...processEnv } = process.env;

export const env = () => (z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  DATABASE_URL: z.string().default('file:./src/server/db/data.db'),
  DB_AUTH_TOKEN: z.string().default(''),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
}).parse(processEnv));