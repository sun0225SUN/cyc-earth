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

const isTurso = () => {
  return !!env.TURSO_DATABASE_URL && env.TURSO_DATABASE_TOKEN !== null
}

const createTursoClient = () => {
  return createClient({
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_DATABASE_TOKEN!,
  })
}

const createLocalClient = () => {
  return createClient({
    url: 'file:./db.sqlite',
  })
}

const createDatabaseClient = () => {
  if (env.NODE_ENV !== 'production' && globalForDb.client) {
    return globalForDb.client
  }

  const newClient = isTurso() ? createTursoClient() : createLocalClient()

  if (env.NODE_ENV !== 'production') {
    globalForDb.client = newClient
  }

  return newClient
}

export const client = createDatabaseClient()

export const db = drizzle(client, { schema })
