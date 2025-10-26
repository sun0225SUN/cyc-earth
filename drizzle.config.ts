import type { Config } from 'drizzle-kit'

import { env } from '@/env'

const dbCredentials =
  env.DATABASE_PROVIDER === 'turso'
    ? {
        url: env.TURSO_DATABASE_URL!,
        authToken: env.TURSO_DATABASE_TOKEN!,
      }
    : {
        url: env.DATABASE_URL!,
      }

export default {
  schema: './src/server/db/schema.ts',
  dialect: env.DATABASE_PROVIDER,
  dbCredentials,
  tablesFilter: ['cyc_earth_*'],
} satisfies Config
