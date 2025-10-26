"""
Strava Authentication

Usage steps:
1. Create an app on Strava Developer Platform to get CLIENT_ID and CLIENT_SECRET
2. Set these two environment variables in the .env file
3. Run this script for authentication
4. Add the obtained token to the .env file
"""

import os
from stravalib import Client
import re
from dotenv import load_dotenv

load_dotenv()

CLIENT_SECRET = os.getenv('STRAVA_CLIENT_SECRET')
CLIENT_ID = os.getenv('STRAVA_CLIENT_ID')


def get_access_token_from_url(url):
    """Get access token from Strava callback URL

    Args:
        url: Strava authorization callback URL

    Returns:
        dict: Dictionary containing access_token, refresh_token, expires_at
    """
    try:
        # Extract authorization code from URL
        code = re.search(r"code=.*&", url)
        if not code:
            raise Exception('Invalid callback URL')

        code = code.group()[5:-1]

        # Exchange authorization code for access token
        client = Client()
        token_data = client.exchange_code_for_token(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            code=code
        )

        return token_data
    except Exception as e:
        raise Exception(f'Error getting access token: {e}')


def obtain_access_token(refresh_token):
    """Obtain a new access token using refresh token

    Args:
        refresh_token: Strava refresh token

    Returns:
        dict: Token data containing access_token, refresh_token, expires_at
    """
    client = Client()
    token_data = client.refresh_access_token(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        refresh_token=refresh_token
    )
    return token_data


def authenticate():
    """Authenticate with Strava and get tokens"""
    if not CLIENT_ID:
        print("❌ Please set STRAVA_CLIENT_ID in the .env file first")
        return

    authorize_url = f"http://www.strava.com/oauth/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read,activity:read"

    print("\nPlease visit the following URL to authorize:")
    print("=" * 80)
    print(authorize_url)
    print("=" * 80)
    print()

    # After authorization, Strava will redirect to your callback URL, copy the full URL
    callback_url = input(
        "Please enter the full callback URL after authorization: ")

    try:
        token_data = get_access_token_from_url(callback_url)

        print("\n✅ Authentication successful!")
        print("\nPlease add the following information to the .env file:")
        print("=" * 80)
        print(f'STRAVA_REFRESH_TOKEN="{token_data['refresh_token']}"')
        print("=" * 80)
        print("\nYou can now run python main.py to get data.")

    except Exception as e:
        print(f"\n❌ Authentication failed: {e}")
        print("\nTip: Make sure the callback URL format is correct")


if __name__ == "__main__":
    authenticate()
