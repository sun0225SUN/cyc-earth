-- Database schema for cyc-earth
-- This file defines the SQL tables for the application

-- Athletes table
CREATE TABLE IF NOT EXISTS cyc_earth_athlete (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT,
    resourceState INTEGER,
    firstname TEXT,
    lastname TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    sex TEXT,
    premium INTEGER,
    badgeTypeId INTEGER,
    profileMedium TEXT,
    profile TEXT,
    friend TEXT,
    follower TEXT,
    followerCount INTEGER,
    friendCount INTEGER,
    mutualFriendCount INTEGER,
    athleteType INTEGER,
    datePreference TEXT,
    measurementPreference TEXT,
    ftp REAL,
    weight REAL,
    createdAt TEXT,
    updatedAt TEXT
);

-- Activities table
CREATE TABLE IF NOT EXISTS cyc_earth_activity (
    id INTEGER PRIMARY KEY NOT NULL,
    resourceState INTEGER,
    athleteId INTEGER,
    athleteResourceState INTEGER,
    name TEXT,
    distance REAL,
    movingTime INTEGER,
    elapsedTime INTEGER,
    totalElevationGain REAL,
    type TEXT,
    sportType TEXT,
    workoutType INTEGER,
    externalId TEXT,
    uploadId INTEGER,
    startDate TEXT,
    startDateLocal TEXT,
    timezone TEXT,
    utcOffset INTEGER,
    startLatlng TEXT,
    endLatlng TEXT,
    locationCity TEXT,
    locationState TEXT,
    locationCountry TEXT,
    achievementCount INTEGER,
    kudosCount INTEGER,
    commentCount INTEGER,
    athleteCount INTEGER,
    photoCount INTEGER,
    mapId TEXT,
    mapSummaryPolyline TEXT,
    mapResourceState INTEGER,
    trainer INTEGER,
    commute INTEGER,
    manual INTEGER,
    private INTEGER,
    flagged INTEGER,
    gearId TEXT,
    fromAcceptedTag INTEGER,
    averageSpeed REAL,
    maxSpeed REAL,
    averageCadence REAL,
    averageWatts REAL,
    weightedAverageWatts REAL,
    kilojoules REAL,
    deviceWatts INTEGER,
    hasHeartrate INTEGER,
    averageHeartrate REAL,
    maxHeartrate INTEGER,
    maxWatts INTEGER,
    prCount INTEGER,
    totalPhotoCount INTEGER,
    hasKudoed INTEGER,
    sufferScore INTEGER
);

-- Tracks table
CREATE TABLE IF NOT EXISTS cyc_earth_tracks (
    id INTEGER PRIMARY KEY NOT NULL,
    GPXData TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS username_idx ON cyc_earth_athlete(username);
CREATE INDEX IF NOT EXISTS athlete_id_idx ON cyc_earth_activity(athleteId);
CREATE INDEX IF NOT EXISTS start_date_idx ON cyc_earth_activity(startDate);

