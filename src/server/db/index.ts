import { env } from '@config/env'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './contributors.model'
import { DefaultLogger, LogWriter } from 'drizzle-orm';

class MyLogWriter implements LogWriter {
  write(message: string) {
    console.log(message);
  }
}
const logger = new DefaultLogger({ writer: new MyLogWriter() });

const { DATABASE_URL, DB_AUTH_TOKEN } = env()

const client = createClient({
  url: DATABASE_URL,
  authToken: DB_AUTH_TOKEN
})

export const db = drizzle({
  client,
  schema,
  logger
})

export { schema }
