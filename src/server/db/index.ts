import { type Client, createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/env'
import * as schema from './schema'

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

export const client =
  env.DATABASE_PROVIDER === 'turso'
    ? (globalForDb.client ??
      createClient({
        url: env.TURSO_DATABASE_URL!,
        authToken: env.TURSO_DATABASE_TOKEN!,
      }))
    : (globalForDb.client ??
      createClient({
        url: env.DATABASE_URL!,
      }))

if (env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
