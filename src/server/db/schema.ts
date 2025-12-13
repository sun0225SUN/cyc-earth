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
    createdAt: d.text({ length: 64 }),
    updatedAt: d.text({ length: 64 }),
  }),
  (t) => [index('username_idx').on(t.username)],
)

export const activities = createTable(
  'activity',
  (d) => ({
    id: d.integer({ mode: 'number' }).primaryKey().notNull(),
    resourceState: d.integer(),
    athleteId: d.integer(),
    athleteResourceState: d.integer(),
    name: d.text({ length: 512 }),
    distance: d.real(),
    movingTime: d.integer(),
    elapsedTime: d.integer(),
    totalElevationGain: d.real(),
    type: d.text({ length: 64 }),
    sportType: d.text({ length: 64 }),
    workoutType: d.integer(),
    externalId: d.text({ length: 256 }),
    uploadId: d.integer(),
    startDate: d.text({ length: 64 }),
    startDateLocal: d.text({ length: 64 }),
    timezone: d.text({ length: 256 }),
    utcOffset: d.integer(),
    startLatlng: d.text({ length: 128 }),
    endLatlng: d.text({ length: 128 }),
    locationCity: d.text({ length: 256 }),
    locationState: d.text({ length: 256 }),
    locationCountry: d.text({ length: 256 }),
    achievementCount: d.integer(),
    kudosCount: d.integer(),
    commentCount: d.integer(),
    athleteCount: d.integer(),
    photoCount: d.integer(),
    mapId: d.text({ length: 256 }),
    mapSummaryPolyline: d.text(),
    mapResourceState: d.integer(),
    trainer: d.integer(),
    commute: d.integer(),
    manual: d.integer(),
    private: d.integer(),
    flagged: d.integer(),
    gearId: d.text({ length: 256 }),
    fromAcceptedTag: d.integer(),
    averageSpeed: d.real(),
    maxSpeed: d.real(),
    averageCadence: d.real(),
    averageWatts: d.real(),
    weightedAverageWatts: d.real(),
    kilojoules: d.real(),
    deviceWatts: d.integer(),
    hasHeartrate: d.integer(),
    averageHeartrate: d.real(),
    maxHeartrate: d.integer(),
    maxWatts: d.integer(),
    prCount: d.integer(),
    totalPhotoCount: d.integer(),
    hasKudoed: d.integer(),
    sufferScore: d.integer(),
  }),
  (t) => [
    index('athlete_id_idx').on(t.athleteId),
    index('start_date_idx').on(t.startDate),
  ],
)

export const tracks = createTable('tracks', (d) => ({
  id: d.integer({ mode: 'number' }).primaryKey().notNull(),
  GPXData: d.text(),
}))
