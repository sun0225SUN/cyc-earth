import requests
from dotenv import load_dotenv
import db
import gpxpy
import time

load_dotenv()


def get_client(token_data):
    from stravalib import Client

    return Client(
        access_token=token_data["access_token"],
        refresh_token=token_data["refresh_token"],
        token_expires=token_data["expires_at"],
    )


def get_activities_from_db():
    conn = db.get_connection()

    try:
        query = "SELECT id FROM cyc_earth_activity ORDER BY startDate DESC"
        result = db.execute_query(conn, query)

        # For Turso, result might be different
        if isinstance(result, dict):
            # Handle Turso response
            rows = []
            for row in result.get("results", []):
                if row.get("success"):
                    data = row.get("response", {}).get("data", {})
                    rows = data.get("rows", [])
            return [
                row[0] if isinstance(row, tuple) and len(row) > 0 else row.get("id")
                for row in rows
            ]
        else:
            # For SQLite, use cursor
            rows = result.fetchall()
            return [row[0] for row in rows]
    finally:
        conn.close()


def get_activity_streams(access_token, activity_id):
    headers = {"Authorization": f"Bearer {access_token}"}

    # Request streams data
    streams_url = f"https://www.strava.com/api/v3/activities/{activity_id}/streams"
    params = {"keys": "latlng,altitude,time"}

    try:
        response = requests.get(streams_url, headers=headers, params=params)

        if response.status_code == 404:
            print(
                f"⚠️ Streams not available for activity {activity_id} (404)", flush=True
            )
            return None

        response.raise_for_status()
        streams_data = response.json()

        # Convert streams to dictionary with keys
        streams_dict = {}
        for stream in streams_data:
            streams_dict[stream["type"]] = stream["data"]

        if "latlng" not in streams_dict:
            print(f"⚠️ No GPS data for activity {activity_id}", flush=True)
            return None

        return streams_dict

    except requests.exceptions.HTTPError as e:
        print(
            f"❌ HTTP error getting streams for activity {activity_id}: {e}", flush=True
        )
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error getting streams for activity {activity_id}: {e}", flush=True)
        return None


def gpx_to_json(gpx_str):
    if not gpx_str:
        return None

    try:
        gpx = gpxpy.parse(gpx_str)

        tracks = []
        for track in gpx.tracks:
            track_segments = []
            for segment in track.segments:
                points = []
                for point in segment.points:
                    points.append(
                        {
                            "latitude": point.latitude,
                            "longitude": point.longitude,
                            "elevation": point.elevation,
                            "time": point.time.isoformat() if point.time else None,
                        }
                    )
                track_segments.append({"points": points})
            tracks.append({"name": track.name, "segments": track_segments})

        return {
            "tracks": tracks,
        }
    except Exception as e:
        print(f"❌ Error parsing GPX: {e}", flush=True)
        return None


def streams_to_gpx(activity_id, streams_dict, start_time=None):
    import gpxpy.gpx
    from datetime import datetime, timezone, timedelta

    gpx = gpxpy.gpx.GPX()

    # Create a track
    gpx_track = gpxpy.gpx.GPXTrack()
    gpx_track.name = f"Activity {activity_id}"
    gpx.tracks.append(gpx_track)

    # Create a segment
    gpx_segment = gpxpy.gpx.GPXTrackSegment()
    gpx_track.segments.append(gpx_segment)

    latlng_data = streams_dict.get("latlng", [])
    altitude_data = streams_dict.get("altitude", [])
    time_data = streams_dict.get("time", [])

    # Calculate start datetime if provided
    start_datetime = None
    if start_time:
        try:
            start_datetime = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        except:
            pass

    # Create points
    for i, coord in enumerate(latlng_data):
        if len(coord) >= 2:
            lat, lon = coord[0], coord[1]

            # Get altitude if available
            elevation = (
                altitude_data[i]
                if i < len(altitude_data) and altitude_data[i] is not None
                else None
            )

            # Get time if available
            point_time = None
            if i < len(time_data) and time_data[i] is not None and start_datetime:
                # time_data is elapsed seconds from start
                try:
                    elapsed_seconds = float(time_data[i])
                    point_time = start_datetime + timedelta(seconds=elapsed_seconds)
                except:
                    point_time = None

            point = gpxpy.gpx.GPXTrackPoint(
                lat, lon, elevation=elevation, time=point_time
            )
            gpx_segment.points.append(point)

    return gpx.to_xml()


def download_activity_gpx(access_token, activity_id, client):
    try:
        streams_dict = get_activity_streams(access_token, activity_id)
        if not streams_dict:
            print(f"⚠️ No streams data for activity {activity_id}", flush=True)
            return None

        gpx_xml = streams_to_gpx(activity_id, streams_dict)

        if not gpx_xml or len(gpx_xml.strip()) == 0:
            print(f"⚠️ Failed to generate GPX for activity {activity_id}", flush=True)
            return None

        return gpx_xml

    except Exception as e:
        print(
            f"❌ Error converting streams to GPX for activity {activity_id}: {e}",
            flush=True,
        )
        return None


def process_activity_track(client, access_token, activity_id):
    try:
        gpx_data = download_activity_gpx(access_token, activity_id, client)
        if not gpx_data:
            # GPX data not available (404 or other error), skip this activity
            return

        json_data = gpx_to_json(gpx_data)
        if not json_data:
            print(f"Could not parse GPX data for activity {activity_id}", flush=True)
            return

        db.save_track(
            {
                "id": activity_id,
                "GPXData": json_data,
            }
        )

    except Exception as e:
        print(f"❌ Error processing activity {activity_id}: {e}", flush=True)


def process_all_activities(token_data):
    # Get all activity IDs from the database
    activity_ids = get_activities_from_db()

    client = get_client(token_data)

    print(f"\n📊 Total activities to process: {len(activity_ids)}", flush=True)

    for i, activity_id in enumerate(activity_ids, 1):
        print(
            f"🔄 Processing activity {i}/{len(activity_ids)} (ID: {activity_id})",
            flush=True,
        )
        process_activity_track(client, token_data["access_token"], activity_id)

        if i < len(activity_ids):
            # Strava API: 100 requests per 15 minutes = 9 seconds per request
            # Using 15 seconds to be safe
            time.sleep(15)

    print("\n✅ All activities processed", flush=True)
