import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@libsql/client'
import sqlite3 from 'sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function syncAthleteData(
  localDb: sqlite3.Database,
  remoteDb: ReturnType<typeof createClient>,
): Promise<void> {
  console.log('👤 Syncing athlete data...')

  return new Promise((resolve) => {
    localDb.all('SELECT * FROM cyc_earth_athlete', async (err, rows) => {
      if (err) {
        console.log('🐛 No athlete data to sync')
        resolve()
        return
      }

      if (!rows || rows.length === 0) {
        console.log('🐛 No athlete data to sync')
        resolve()
        return
      }

      try {
        // Clear existing data
        await remoteDb.execute({ sql: 'DELETE FROM cyc_earth_athlete' })

        // Insert new data
        for (const row of rows) {
          const columns = Object.keys(row as Record<string, unknown>)
          const placeholders = columns.map(() => '?').join(', ')
          const columnsStr = columns.join(', ')
          const query = `INSERT INTO cyc_earth_athlete (${columnsStr}) VALUES (${placeholders})`
          // biome-ignore lint/suspicious/noExplicitAny: needed for sqlite3
          const values = columns.map((col) => (row as Record<string, any>)[col])
          await remoteDb.execute({ sql: query, args: values })
        }

        console.log('✅ Athlete synced')
        resolve()
      } catch (error) {
        console.error('⚠️  Error syncing athlete:', error)
        resolve()
      }
    })
  })
}

async function syncActivityData(
  localDb: sqlite3.Database,
  remoteDb: ReturnType<typeof createClient>,
): Promise<void> {
  console.log('🚴 Syncing activity data...')

  return new Promise((resolve) => {
    localDb.all('SELECT * FROM cyc_earth_activity', async (err, rows) => {
      if (err || !rows || rows.length === 0) {
        console.log('🐛 No activities to sync')
        resolve()
        return
      }

      try {
        // Clear existing data
        await remoteDb.execute({ sql: 'DELETE FROM cyc_earth_activity' })

        // Insert all activities
        for (const row of rows) {
          const columns = Object.keys(row as Record<string, unknown>)
          const placeholders = columns.map(() => '?').join(', ')
          const columnsStr = columns.join(', ')
          const query = `INSERT INTO cyc_earth_activity (${columnsStr}) VALUES (${placeholders})`
          // biome-ignore lint/suspicious/noExplicitAny: needed for sqlite3
          const values = columns.map((col) => (row as Record<string, any>)[col])
          await remoteDb.execute({ sql: query, args: values })
        }

        console.log(`✅ Synced ${rows.length} activities`)
        resolve()
      } catch (error) {
        console.error('⚠️  Error syncing activities:', error)
        resolve()
      }
    })
  })
}

async function syncTracksData(
  localDb: sqlite3.Database,
  remoteDb: ReturnType<typeof createClient>,
): Promise<void> {
  console.log('📍 Syncing tracks data...')

  return new Promise((resolve) => {
    localDb.all('SELECT * FROM cyc_earth_tracks', async (err, rows) => {
      if (err || !rows || rows.length === 0) {
        console.log('🐛 No tracks to sync')
        resolve()
        return
      }

      try {
        // Clear existing data
        await remoteDb.execute({ sql: 'DELETE FROM cyc_earth_tracks' })

        // Insert all tracks
        for (const row of rows) {
          const columns = Object.keys(row as Record<string, unknown>)
          const placeholders = columns.map(() => '?').join(', ')
          const columnsStr = columns.join(', ')
          const query = `INSERT INTO cyc_earth_tracks (${columnsStr}) VALUES (${placeholders})`
          // biome-ignore lint/suspicious/noExplicitAny: needed for sqlite3
          const values = columns.map((col) => (row as Record<string, any>)[col])
          await remoteDb.execute({ sql: query, args: values })
        }

        console.log(`✅ Synced ${rows.length} tracks`)
        resolve()
      } catch (error) {
        console.error('⚠️  Error syncing tracks:', error)
        resolve()
      }
    })
  })
}

async function syncToTurso(): Promise<void> {
  try {
    console.log('🔄 Syncing local database to Turso...')

    const databaseUrl = 'file:./db.sqlite'
    const dbPath = databaseUrl.startsWith('file:')
      ? resolve(__dirname, '..', databaseUrl.slice(5))
      : databaseUrl

    console.log(`📁 Local database: ${dbPath}`)

    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_DATABASE_TOKEN

    if (!tursoUrl || !tursoToken) {
      console.log('⚠️  TURSO_DATABASE_URL and TURSO_DATABASE_TOKEN not set')
      console.log('📥 Skipping Turso sync')
      return
    }

    console.log(`☁️  Connecting to Turso: ${tursoUrl}`)

    // Connect to local database
    const localDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening local database:', err)
        process.exit(1)
      }
    })

    // Connect to remote database
    const remoteDb = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    })

    // Sync data
    await syncAthleteData(localDb, remoteDb)
    await syncActivityData(localDb, remoteDb)
    await syncTracksData(localDb, remoteDb)

    localDb.close()
    console.log('🎉 Database synced successfully!')
  } catch (error) {
    console.error('⚠️  Failed to sync to Turso:', error)
    process.exit(1)
  }
}

console.log('🚀 Starting Turso sync...')
syncToTurso()
  .then(() => {
    console.log('\n✅ Sync complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
