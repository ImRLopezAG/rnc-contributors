import { env } from '@config/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql/web';
import * as schema from './contributors.model';

const { DATABASE_URL, DB_AUTH_TOKEN } = env();

const client = createClient({
  url: DATABASE_URL,
  authToken: DB_AUTH_TOKEN,
});

export const db = drizzle({
  client,
  schema
});

export { schema };
