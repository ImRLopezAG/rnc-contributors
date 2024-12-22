import { env } from '@config/env';
import { drizzle } from 'drizzle-orm/libsql/node';
import * as schema from './contributors.model';

const { DATABASE_URL } = env();

export const db = drizzle({
  schema,
  connection: {
    url: DATABASE_URL,
  },
});

export { schema };