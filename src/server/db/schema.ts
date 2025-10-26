// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { index, sqliteTableCreator } from 'drizzle-orm/sqlite-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `cyc_earth_${name}`)

export const athletes = createTable(
  'athlete',
  (d) => ({
    id: d.integer({ mode: 'number' }).primaryKey().notNull(),
    username: d.text({ length: 256 }),
    resourceState: d.integer(),
    firstname: d.text({ length: 256 }),
    lastname: d.text({ length: 256 }),
    city: d.text({ length: 256 }),
    state: d.text({ length: 256 }),
    country: d.text({ length: 256 }),
    sex: d.text({ length: 1 }),
    premium: d.integer(),
    createdAt: d.text({ length: 256 }),
    updatedAt: d.text({ length: 256 }),
    badgeTypeId: d.integer(),
    profileMedium: d.text({ length: 512 }),
    profile: d.text({ length: 512 }),
    friend: d.text(),
    follower: d.text(),
    followerCount: d.integer(),
    friendCount: d.integer(),
    mutualFriendCount: d.integer(),
    athleteType: d.integer(),
    datePreference: d.text({ length: 256 }),
    measurementPreference: d.text({ length: 256 }),
    ftp: d.real(),
    weight: d.real(),
  }),
  (t) => [index('username_idx').on(t.username)],
)
