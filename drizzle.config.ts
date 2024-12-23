import { env } from '@config/env';
import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL, DB_AUTH_TOKEN } = env();

export default defineConfig({
  dialect: 'turso',
  schema: './src/db/*.model.ts',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DB_AUTH_TOKEN,
  },
});
