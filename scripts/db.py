import os
import sqlite3
from dotenv import load_dotenv
import pathlib
import json

load_dotenv()


def get_connection():
    script_dir = pathlib.Path(__file__).parent
    project_root = script_dir.parent
    db_path = project_root / "db.sqlite"

    return sqlite3.connect(str(db_path))


def execute_query(conn, query, params=None):
    """Execute a query on SQLite connection"""
    cursor = conn.cursor()
    cursor.execute(query, params if params else ())
    return cursor


def ensure_tables_exist(conn):
    """Ensure database tables exist, create them if they don't"""
    cursor = conn.cursor()

    # Check if tables exist
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cyc_earth_athlete'"
    )
    if cursor.fetchone():
        return  # Tables already exist

    print("📋 Creating database tables from schema...", flush=True)

    # Load and execute schema file
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")

    with open(schema_path, "r") as f:
        schema_sql = f.read()

    # Execute the schema SQL
    cursor.executescript(schema_sql)
    conn.commit()
    print("✅ Database tables created from schema.sql", flush=True)


def save_athlete(athlete_data):
    conn = get_connection()

    # Ensure tables exist before saving data
    ensure_tables_exist(conn)

    try:
        athlete_values = (
            athlete_data.get("id"),
            athlete_data.get("username"),
            athlete_data.get("resource_state"),
            athlete_data.get("firstname"),
            athlete_data.get("lastname"),
            athlete_data.get("city"),
            athlete_data.get("state"),
            athlete_data.get("country"),
            athlete_data.get("sex"),
            1 if athlete_data.get("premium") else 0,
            athlete_data.get("created_at"),
            athlete_data.get("updated_at"),
            athlete_data.get("badge_type_id"),
            athlete_data.get("profile_medium"),
            athlete_data.get("profile"),
            athlete_data.get("friend"),
            athlete_data.get("follower"),
            athlete_data.get("follower_count"),
            athlete_data.get("friend_count"),
            athlete_data.get("mutual_friend_count"),
            athlete_data.get("athlete_type"),
            athlete_data.get("date_preference"),
            athlete_data.get("measurement_preference"),
            athlete_data.get("ftp"),
            athlete_data.get("weight"),
        )

        query = """
            INSERT OR REPLACE INTO cyc_earth_athlete (
                id, username, resourceState, firstname, lastname, city, state, country,
                sex, premium, createdAt, updatedAt, badgeTypeId, profileMedium, profile,
                friend, follower, followerCount, friendCount, mutualFriendCount,
                athleteType, datePreference, measurementPreference, ftp, weight
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        execute_query(conn, query, athlete_values)
        conn.commit()

        athlete_id = athlete_data.get("id")
        print(f"✅ Athlete data saved successfully (ID: {athlete_id})", flush=True)

    except Exception as e:
        conn.rollback()
        print(f"❌ Database error: {e}", flush=True)
        raise
    finally:
        conn.close()


def save_activity(activity_data):
    conn = get_connection()

    # Ensure tables exist before saving data
    ensure_tables_exist(conn)

    try:
        # Extract athlete and map data
        athlete = activity_data.get("athlete", {})
        athlete_id = athlete.get("id") if athlete else None
        athlete_resource_state = athlete.get("resource_state") if athlete else None

        map_data = activity_data.get("map", {})
        map_id = map_data.get("id") if map_data else None
        map_summary_polyline = map_data.get("summary_polyline") if map_data else None
        map_resource_state = map_data.get("resource_state") if map_data else None

        # Handle latlng arrays
        start_latlng = activity_data.get("start_latlng")
        end_latlng = activity_data.get("end_latlng")
        start_latlng_str = (
            f"{start_latlng[0]},{start_latlng[1]}"
            if start_latlng and len(start_latlng) == 2
            else None
        )
        end_latlng_str = (
            f"{end_latlng[0]},{end_latlng[1]}"
            if end_latlng and len(end_latlng) == 2
            else None
        )

        # Convert boolean values to integers
        trainer = 1 if activity_data.get("trainer") else 0
        commute = 1 if activity_data.get("commute") else 0
        manual = 1 if activity_data.get("manual") else 0
        private = 1 if activity_data.get("private") else 0
        flagged = 1 if activity_data.get("flagged") else 0
        from_accepted_tag = 1 if activity_data.get("from_accepted_tag") else 0
        device_watts = 1 if activity_data.get("device_watts") else 0
        has_heartrate = 1 if activity_data.get("has_heartrate") else 0
        has_kudoed = 1 if activity_data.get("has_kudoed") else 0

        activity_values = (
            activity_data.get("id"),
            activity_data.get("resource_state"),
            athlete_id,
            athlete_resource_state,
            activity_data.get("name"),
            activity_data.get("distance"),
            activity_data.get("moving_time"),
            activity_data.get("elapsed_time"),
            activity_data.get("total_elevation_gain"),
            activity_data.get("type"),
            activity_data.get("sport_type"),
            activity_data.get("workout_type"),
            activity_data.get("external_id"),
            activity_data.get("upload_id"),
            activity_data.get("start_date"),
            activity_data.get("start_date_local"),
            activity_data.get("timezone"),
            activity_data.get("utc_offset"),
            start_latlng_str,
            end_latlng_str,
            activity_data.get("location_city"),
            activity_data.get("location_state"),
            activity_data.get("location_country"),
            activity_data.get("achievement_count"),
            activity_data.get("kudos_count"),
            activity_data.get("comment_count"),
            activity_data.get("athlete_count"),
            activity_data.get("photo_count"),
            map_id,
            map_summary_polyline,
            map_resource_state,
            trainer,
            commute,
            manual,
            private,
            flagged,
            activity_data.get("gear_id"),
            from_accepted_tag,
            activity_data.get("average_speed"),
            activity_data.get("max_speed"),
            activity_data.get("average_cadence"),
            activity_data.get("average_watts"),
            activity_data.get("weighted_average_watts"),
            activity_data.get("kilojoules"),
            device_watts,
            has_heartrate,
            activity_data.get("average_heartrate"),
            activity_data.get("max_heartrate"),
            activity_data.get("max_watts"),
            activity_data.get("pr_count"),
            activity_data.get("total_photo_count"),
            has_kudoed,
            activity_data.get("suffer_score"),
        )

        query = """
            INSERT OR REPLACE INTO cyc_earth_activity (
                id, resourceState, athleteId, athleteResourceState, name, distance,
                movingTime, elapsedTime, totalElevationGain, type, sportType, workoutType,
                externalId, uploadId, startDate, startDateLocal, timezone, utcOffset,
                startLatlng, endLatlng, locationCity, locationState, locationCountry,
                achievementCount, kudosCount, commentCount, athleteCount, photoCount,
                mapId, mapSummaryPolyline, mapResourceState, trainer, commute, manual, private,
                flagged, gearId, fromAcceptedTag, averageSpeed, maxSpeed, averageCadence,
                averageWatts, weightedAverageWatts, kilojoules, deviceWatts, hasHeartrate,
                averageHeartrate, maxHeartrate, maxWatts, prCount, totalPhotoCount, hasKudoed,
                sufferScore
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        execute_query(conn, query, activity_values)
        conn.commit()

        print(
            f"✅ Activity data saved successfully (ID: {activity_data.get('id')})",
            flush=True,
        )

    except Exception as e:
        conn.rollback()
        print(f"❌ Database error: {e}", flush=True)
        raise
    finally:
        conn.close()


def save_track(track_dict):
    conn = get_connection()

    # Ensure tables exist before saving data
    ensure_tables_exist(conn)

    try:
        track_values = (
            track_dict.get("id"),
            (
                json.dumps(track_dict.get("GPXData"))
                if track_dict.get("GPXData")
                else None
            ),
        )

        query = """
            INSERT OR REPLACE INTO cyc_earth_tracks (
                id, GPXData
            ) VALUES (?, ?)
        """

        execute_query(conn, query, track_values)
        conn.commit()

        print(
            f"✅ Track data saved successfully (ID: {track_dict.get('id')})", flush=True
        )

    except Exception as e:
        conn.rollback()
        print(f"❌ Database error: {e}", flush=True)
        raise
    finally:
        conn.close()
