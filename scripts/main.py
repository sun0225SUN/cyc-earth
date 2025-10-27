import os
from stravalib import Client
from dotenv import load_dotenv
import auth
import db
import process_activities_data

load_dotenv()


def get_client(token_data):
    return Client(
        access_token=token_data["access_token"],
        refresh_token=token_data["refresh_token"],
        token_expires=token_data["expires_at"],
    )


def get_athlete(token_data):
    client = get_client(token_data)

    print(f"\n🔄 Fetching athlete data from Strava...", flush=True)

    athlete = client.get_athlete()

    athlete_dict = {
        "id": athlete.id,
        "username": athlete.username if hasattr(athlete, "username") else None,
        "resource_state": athlete.resource_state,
        "firstname": athlete.firstname,
        "lastname": athlete.lastname,
        "city": athlete.city if hasattr(athlete, "city") else None,
        "state": athlete.state if hasattr(athlete, "state") else None,
        "country": athlete.country if hasattr(athlete, "country") else None,
        "sex": athlete.sex if hasattr(athlete, "sex") else None,
        "premium": athlete.premium if hasattr(athlete, "premium") else False,
        "created_at": (
            str(athlete.created_at)
            if hasattr(athlete, "created_at") and athlete.created_at
            else None
        ),
        "updated_at": (
            str(athlete.updated_at)
            if hasattr(athlete, "updated_at") and athlete.updated_at
            else None
        ),
        "badge_type_id": (
            athlete.badge_type_id if hasattr(athlete, "badge_type_id") else None
        ),
        "profile_medium": (
            athlete.profile_medium if hasattr(athlete, "profile_medium") else None
        ),
        "profile": athlete.profile if hasattr(athlete, "profile") else None,
        "friend": (
            str(athlete.friend)
            if hasattr(athlete, "friend") and athlete.friend
            else None
        ),
        "follower": (
            str(athlete.follower)
            if hasattr(athlete, "follower") and athlete.follower
            else None
        ),
        "follower_count": (
            athlete.follower_count if hasattr(athlete, "follower_count") else None
        ),
        "friend_count": (
            athlete.friend_count if hasattr(athlete, "friend_count") else None
        ),
        "mutual_friend_count": (
            athlete.mutual_friend_count
            if hasattr(athlete, "mutual_friend_count")
            else None
        ),
        "athlete_type": (
            athlete.athlete_type if hasattr(athlete, "athlete_type") else None
        ),
        "date_preference": (
            athlete.date_preference if hasattr(athlete, "date_preference") else None
        ),
        "measurement_preference": (
            athlete.measurement_preference
            if hasattr(athlete, "measurement_preference")
            else None
        ),
        "ftp": athlete.ftp if hasattr(athlete, "ftp") else None,
        "weight": athlete.weight if hasattr(athlete, "weight") else None,
        "created_at": (
            athlete.created_at.isoformat()
            if hasattr(athlete, "created_at") and athlete.created_at
            else None
        ),
        "updated_at": (
            athlete.updated_at.isoformat()
            if hasattr(athlete, "updated_at") and athlete.updated_at
            else None
        ),
    }

    db.save_athlete(athlete_dict)


def get_activities(token_data):
    client = get_client(token_data)

    print(f"\n🔄 Fetching activities from Strava...", flush=True)

    activities = client.get_activities()

    count = 0
    total = 0
    filtered_count = 0

    print("⏳ Processing activities (this may take a while)...", flush=True)

    # First pass: count and filter activities
    filtered_activities = []
    for activity in activities:
        total += 1
        if total % 10 == 0:
            print(f"  Checked {total} activities...", flush=True)
        if activity.type == "Ride":
            filtered_count += 1
            filtered_activities.append(activity)

    print(
        f"📊 Found {filtered_count} Ride activities out of {total} total activities",
        flush=True,
    )

    for activity in filtered_activities:
        try:

            def duration_to_seconds(duration):
                if not duration:
                    return None
                try:
                    return int(duration)
                except (TypeError, ValueError):
                    return None

            activity_dict = {
                "id": activity.id,
                "resource_state": (
                    activity.resource_state
                    if hasattr(activity, "resource_state")
                    else None
                ),
                "athlete": {
                    "id": (
                        activity.athlete.id
                        if hasattr(activity, "athlete")
                        and hasattr(activity.athlete, "id")
                        else None
                    ),
                    "resource_state": (
                        activity.athlete.resource_state
                        if hasattr(activity, "athlete")
                        and hasattr(activity.athlete, "resource_state")
                        else None
                    ),
                },
                "name": activity.name,
                "distance": float(activity.distance) if activity.distance else None,
                "moving_time": duration_to_seconds(activity.moving_time),
                "elapsed_time": duration_to_seconds(activity.elapsed_time),
                "total_elevation_gain": (
                    float(activity.total_elevation_gain)
                    if activity.total_elevation_gain
                    else None
                ),
                "type": (
                    str(activity.type)
                    if hasattr(activity, "type") and activity.type
                    else None
                ),
                "sport_type": (
                    str(activity.sport_type)
                    if hasattr(activity, "sport_type") and activity.sport_type
                    else None
                ),
                "workout_type": (
                    activity.workout_type if hasattr(activity, "workout_type") else None
                ),
                "external_id": (
                    activity.external_id if hasattr(activity, "external_id") else None
                ),
                "upload_id": (
                    activity.upload_id if hasattr(activity, "upload_id") else None
                ),
                "start_date": (
                    str(activity.start_date)
                    if hasattr(activity, "start_date") and activity.start_date
                    else None
                ),
                "start_date_local": (
                    str(activity.start_date_local)
                    if hasattr(activity, "start_date_local")
                    and activity.start_date_local
                    else None
                ),
                "timezone": (
                    activity.timezone if hasattr(activity, "timezone") else None
                ),
                "utc_offset": (
                    activity.utc_offset if hasattr(activity, "utc_offset") else None
                ),
                "start_latlng": (
                    list(activity.start_latlng)
                    if hasattr(activity, "start_latlng") and activity.start_latlng
                    else None
                ),
                "end_latlng": (
                    list(activity.end_latlng)
                    if hasattr(activity, "end_latlng") and activity.end_latlng
                    else None
                ),
                "location_city": (
                    activity.location_city
                    if hasattr(activity, "location_city")
                    else None
                ),
                "location_state": (
                    activity.location_state
                    if hasattr(activity, "location_state")
                    else None
                ),
                "location_country": (
                    activity.location_country
                    if hasattr(activity, "location_country")
                    else None
                ),
                "achievement_count": (
                    activity.achievement_count
                    if hasattr(activity, "achievement_count")
                    else None
                ),
                "kudos_count": (
                    activity.kudos_count if hasattr(activity, "kudos_count") else None
                ),
                "comment_count": (
                    activity.comment_count
                    if hasattr(activity, "comment_count")
                    else None
                ),
                "athlete_count": (
                    activity.athlete_count
                    if hasattr(activity, "athlete_count")
                    else None
                ),
                "photo_count": (
                    activity.photo_count if hasattr(activity, "photo_count") else None
                ),
                "map": {
                    "id": (
                        activity.map.id
                        if hasattr(activity, "map")
                        and activity.map
                        and hasattr(activity.map, "id")
                        else None
                    ),
                    "summary_polyline": (
                        activity.map.summary_polyline
                        if hasattr(activity, "map")
                        and activity.map
                        and hasattr(activity.map, "summary_polyline")
                        else None
                    ),
                    "resource_state": (
                        activity.map.resource_state
                        if hasattr(activity, "map")
                        and activity.map
                        and hasattr(activity.map, "resource_state")
                        else None
                    ),
                },
                "trainer": activity.trainer if hasattr(activity, "trainer") else False,
                "commute": activity.commute if hasattr(activity, "commute") else False,
                "manual": activity.manual if hasattr(activity, "manual") else False,
                "private": activity.private if hasattr(activity, "private") else False,
                "flagged": activity.flagged if hasattr(activity, "flagged") else False,
                "gear_id": activity.gear_id if hasattr(activity, "gear_id") else None,
                "from_accepted_tag": (
                    activity.from_accepted_tag
                    if hasattr(activity, "from_accepted_tag")
                    else False
                ),
                "average_speed": (
                    float(activity.average_speed) if activity.average_speed else None
                ),
                "max_speed": float(activity.max_speed) if activity.max_speed else None,
                "average_cadence": (
                    activity.average_cadence
                    if hasattr(activity, "average_cadence")
                    else None
                ),
                "average_watts": (
                    activity.average_watts
                    if hasattr(activity, "average_watts")
                    else None
                ),
                "weighted_average_watts": (
                    activity.weighted_average_watts
                    if hasattr(activity, "weighted_average_watts")
                    else None
                ),
                "kilojoules": (
                    activity.kilojoules if hasattr(activity, "kilojoules") else None
                ),
                "device_watts": (
                    activity.device_watts
                    if hasattr(activity, "device_watts")
                    else False
                ),
                "has_heartrate": (
                    activity.has_heartrate
                    if hasattr(activity, "has_heartrate")
                    else False
                ),
                "average_heartrate": (
                    activity.average_heartrate
                    if hasattr(activity, "average_heartrate")
                    else None
                ),
                "max_heartrate": (
                    activity.max_heartrate
                    if hasattr(activity, "max_heartrate")
                    else None
                ),
                "max_watts": (
                    activity.max_watts if hasattr(activity, "max_watts") else None
                ),
                "pr_count": (
                    activity.pr_count if hasattr(activity, "pr_count") else None
                ),
                "total_photo_count": (
                    activity.total_photo_count
                    if hasattr(activity, "total_photo_count")
                    else None
                ),
                "has_kudoed": (
                    activity.has_kudoed if hasattr(activity, "has_kudoed") else False
                ),
                "suffer_score": (
                    activity.suffer_score if hasattr(activity, "suffer_score") else None
                ),
                "created_at": (
                    str(activity.created_at)
                    if hasattr(activity, "created_at") and activity.created_at
                    else None
                ),
                "updated_at": (
                    str(activity.updated_at)
                    if hasattr(activity, "updated_at") and activity.updated_at
                    else None
                ),
            }

            db.save_activity(activity_dict)
            count += 1
            if count % 10 == 0:
                print(f"  Saved {count}/{filtered_count} activities...", flush=True)

        except Exception as e:
            print(
                f"❌ Error processing activity {activity.id if hasattr(activity, 'id') else 'unknown'}: {e}",
                flush=True,
            )
            continue

    print(f"\n✅ Total {count} activities saved to database", flush=True)


if __name__ == "__main__":
    print("🚀 Starting Strava data sync...", flush=True)

    refresh_token = os.getenv("STRAVA_REFRESH_TOKEN")

    if not refresh_token:
        print("Please set the STRAVA_REFRESH_TOKEN environment variable", flush=True)
        print("\nTo get a refresh token, run:", flush=True)
        print("  python3 auth.py", flush=True)
        exit(1)

    print("🔄 Getting access token...", flush=True)
    token_data = auth.get_access_token_from_refresh_token(refresh_token)

    get_athlete(token_data)
    get_activities(token_data)

    print("\n🔄 Starting to process activity tracks...", flush=True)
    process_activities_data.process_all_activities(token_data)

    print("\n✅ All done!", flush=True)
