import os
import sqlite3
from urllib.parse import urlparse
from dotenv import load_dotenv
import re
import pathlib

load_dotenv()


def parse_database_url(url):
    # Handle file:// protocol
    if url.startswith("file://"):
        parsed = urlparse(url)
        return parsed.path

    # Handle file: protocol (used by Prisma/Drizzle)
    if url.startswith("file:"):
        path = url[5:]  # Remove "file:" prefix

        # Get absolute path relative to project root
        script_dir = pathlib.Path(__file__).parent
        project_root = script_dir.parent
        abs_path = project_root / path.lstrip('./')

        return str(abs_path)

    return url


def get_connection():
    database_url = os.getenv('DATABASE_URL')

    if not database_url:
        raise Exception("Please set the DATABASE_URL environment variable")

    db_path = parse_database_url(database_url)

    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    return sqlite3.connect(db_path)


def save_athlete(athlete_data):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        athlete_values = (
            athlete_data.get('id'),
            athlete_data.get('username'),
            athlete_data.get('resource_state'),
            athlete_data.get('firstname'),
            athlete_data.get('lastname'),
            athlete_data.get('city'),
            athlete_data.get('state'),
            athlete_data.get('country'),
            athlete_data.get('sex'),
            1 if athlete_data.get('premium') else 0,
            athlete_data.get('created_at'),
            athlete_data.get('updated_at'),
            athlete_data.get('badge_type_id'),
            athlete_data.get('profile_medium'),
            athlete_data.get('profile'),
            athlete_data.get('friend'),
            athlete_data.get('follower'),
            athlete_data.get('follower_count'),
            athlete_data.get('friend_count'),
            athlete_data.get('mutual_friend_count'),
            athlete_data.get('athlete_type'),
            athlete_data.get('date_preference'),
            athlete_data.get('measurement_preference'),
            athlete_data.get('ftp'),
            athlete_data.get('weight'),
        )

        cursor.execute("""
            INSERT OR REPLACE INTO cyc_earth_athlete (
                id, username, resourceState, firstname, lastname, city, state, country,
                sex, premium, createdAt, updatedAt, badgeTypeId, profileMedium, profile,
                friend, follower, followerCount, friendCount, mutualFriendCount,
                athleteType, datePreference, measurementPreference, ftp, weight
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, athlete_values)

        conn.commit()

        athlete_id = athlete_data.get('id')

        print(f"✅ Athlete data saved successfully (ID: {athlete_id})")

    except sqlite3.Error as e:
        conn.rollback()
        print(f"❌ Database error: {e}")
        raise
    finally:
        conn.close()
