import { config } from 'dotenv';
import { z } from 'zod';
config();
const { ...processEnv } = process.env;

export const env = () => (z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  DATABASE_URL: z.string().default('file:./src/db/data.db'),
  DB_AUTH_TOKEN: z.string().default(''),
}).parse(processEnv));