import type { Config } from 'drizzle-kit'

import { env } from '@/env'

const isTurso = () => {
  return !!env.TURSO_DATABASE_URL && env.TURSO_DATABASE_TOKEN !== null
}

const getTursoCredentials = () => {
  return {
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_DATABASE_TOKEN!,
  }
}

const getLocalCredentials = () => {
  return {
    url: 'file:./db.sqlite',
  }
}

const getDbCredentials = () => {
  return isTurso() ? getTursoCredentials() : getLocalCredentials()
}

export default {
  schema: './src/server/db/schema.ts',
  dialect: isTurso() ? 'turso' : 'sqlite',
  dbCredentials: getDbCredentials(),
  tablesFilter: ['cyc_earth_*'],
} satisfies Config
