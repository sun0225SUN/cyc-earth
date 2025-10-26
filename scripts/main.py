import os
from stravalib import Client
from dotenv import load_dotenv
import auth
import db

load_dotenv()


def get_athlete(token_data):
    client = Client(
        access_token=token_data['access_token'],
        refresh_token=token_data['refresh_token'],
        token_expires=token_data['expires_at']
    )

    print("Fetching athlete data from Strava...")

    athlete = client.get_athlete()

    athlete_dict = {
        'id': athlete.id,
        'username': athlete.username if hasattr(athlete, 'username') else None,
        'resource_state': athlete.resource_state,
        'firstname': athlete.firstname,
        'lastname': athlete.lastname,
        'city': athlete.city if hasattr(athlete, 'city') else None,
        'state': athlete.state if hasattr(athlete, 'state') else None,
        'country': athlete.country if hasattr(athlete, 'country') else None,
        'sex': athlete.sex if hasattr(athlete, 'sex') else None,
        'premium': athlete.premium if hasattr(athlete, 'premium') else False,
        'created_at': str(athlete.created_at) if hasattr(athlete, 'created_at') and athlete.created_at else None,
        'updated_at': str(athlete.updated_at) if hasattr(athlete, 'updated_at') and athlete.updated_at else None,
        'badge_type_id': athlete.badge_type_id if hasattr(athlete, 'badge_type_id') else None,
        'profile_medium': athlete.profile_medium if hasattr(athlete, 'profile_medium') else None,
        'profile': athlete.profile if hasattr(athlete, 'profile') else None,
        'friend': str(athlete.friend) if hasattr(athlete, 'friend') and athlete.friend else None,
        'follower': str(athlete.follower) if hasattr(athlete, 'follower') and athlete.follower else None,
        'follower_count': athlete.follower_count if hasattr(athlete, 'follower_count') else None,
        'friend_count': athlete.friend_count if hasattr(athlete, 'friend_count') else None,
        'mutual_friend_count': athlete.mutual_friend_count if hasattr(athlete, 'mutual_friend_count') else None,
        'athlete_type': athlete.athlete_type if hasattr(athlete, 'athlete_type') else None,
        'date_preference': athlete.date_preference if hasattr(athlete, 'date_preference') else None,
        'measurement_preference': athlete.measurement_preference if hasattr(athlete, 'measurement_preference') else None,
        'ftp': athlete.ftp if hasattr(athlete, 'ftp') else None,
        'weight': athlete.weight if hasattr(athlete, 'weight') else None,
    }

    print("\nSaving athlete data to database...")
    db.save_athlete(athlete_dict)


if __name__ == "__main__":
    refresh_token = os.getenv('STRAVA_REFRESH_TOKEN')

    if not refresh_token:
        print("Please set the STRAVA_REFRESH_TOKEN environment variable")
        print("\nTo get a refresh token, run:")
        print("  python auth.py")
        exit(1)

    print("\nRefreshing access token...")
    token_data = auth.obtain_access_token(refresh_token)
    print("✅ Access token refreshed successfully")

    get_athlete(token_data)
