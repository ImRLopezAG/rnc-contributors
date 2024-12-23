import { env } from '@config/env';
import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL, DB_AUTH_TOKEN, NODE_ENV } = env();

export default defineConfig({
  dialect: NODE_ENV === 'production' ? 'turso' : 'sqlite',
  schema: './src/server/db/*.model.ts',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DB_AUTH_TOKEN,
  },
});
