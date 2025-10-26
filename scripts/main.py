"""
Strava Data Management Script

This script provides functions for fetching athlete activity data
"""

import os
from stravalib import Client
from dotenv import load_dotenv
import auth

load_dotenv()


def get_athlete(token_data):
    client = Client(
        access_token=token_data['access_token'],
        refresh_token=token_data['refresh_token'],
        token_expires=token_data['expires_at']
    )
    athlete = client.get_athlete()
    print("Hello, {}".format(athlete.firstname))


if __name__ == "__main__":
    refresh_token = os.getenv('STRAVA_REFRESH_TOKEN')

    if not refresh_token:
        print("Please set the STRAVA_REFRESH_TOKEN environment variable")
        print("\nTo get a refresh token, run:")
        print("  python auth.py")
        exit(1)

    # Get a new access token using refresh token
    print("Refreshing access token...")
    token_data = auth.obtain_access_token(refresh_token)
    print("✅ Access token refreshed successfully")

    get_athlete(token_data)
