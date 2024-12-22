import { env } from '@config/env';
import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL } = env();

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/*.model.ts',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
