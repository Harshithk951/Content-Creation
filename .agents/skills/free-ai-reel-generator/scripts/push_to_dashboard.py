#!/usr/bin/env python3
"""
Push an episode to the ReelVault Supabase dashboard & storage.
Usage:
    python3 push_to_dashboard.py --episode 2 --title "Midjourney vs Flux" --file Exports/100DaysOfFreeAI_Day02_MidjourneyVsFlux.mp4
"""

import argparse
import json
import os
import ssl
import sys
import urllib.request
import urllib.error

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://tqtfkuhtvkevqhhmnkfv.supabase.co")
ANON_KEY = os.environ.get(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGZrdWh0dmtldnFoaG1ua2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDEyMDMsImV4cCI6MjA3MDgxNzIwM30.yXNC4ibZmHtO0o6BEttF7sBET4sF49Kr4vmGkHu3-C4"
)

def upload_video(file_path: str, remote_filename: str) -> str:
    ctx = ssl._create_unverified_context()
    file_size = os.path.getsize(file_path)
    print(f"Uploading {file_path} ({file_size} bytes) to Supabase Storage: reel-videos/{remote_filename}...")
    
    with open(file_path, "rb") as f:
        video_bytes = f.read()

    upload_url = f"{SUPABASE_URL}/storage/v1/object/reel-videos/{remote_filename}"
    req = urllib.request.Request(
        upload_url,
        data=video_bytes,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "video/mp4",
            "x-upsert": "true",
        },
        method="POST",
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            print("Storage upload successful:", resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Storage note ({e.code}): {e.read().decode()}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/reel-videos/{remote_filename}"
    return public_url, file_size

def upsert_database(payload: dict) -> None:
    ctx = ssl._create_unverified_context()
    ep_num = payload["episode_number"]
    
    # Check if record already exists for this episode
    check_url = f"{SUPABASE_URL}/rest/v1/videos?episode_number=eq.{ep_num}&select=id"
    req_check = urllib.request.Request(
        check_url,
        headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"},
    )
    
    existing_id = None
    try:
        with urllib.request.urlopen(req_check, context=ctx) as resp:
            data = json.loads(resp.read().decode())
            if data:
                existing_id = data[0]["id"]
    except Exception as e:
        print("Check error:", e)

    if existing_id:
        print(f"Updating existing record (ID: {existing_id}) for Episode {ep_num}...")
        url = f"{SUPABASE_URL}/rest/v1/videos?id=eq.{existing_id}"
        method = "PATCH"
    else:
        print(f"Inserting new record for Episode {ep_num}...")
        url = f"{SUPABASE_URL}/rest/v1/videos"
        method = "POST"

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        method=method,
    )
    with urllib.request.urlopen(req, context=ctx) as resp:
        res = json.loads(resp.read().decode())
        print("Database sync successful!")
        if isinstance(res, list) and res:
            print("  Record:", res[0].get("title"), "(Episode", res[0].get("episode_number"), ")")

def main():
    parser = argparse.ArgumentParser(description="Push video to ReelVault Supabase Dashboard")
    parser.add_argument("--episode", type=int, required=True, help="Episode number (e.g. 2)")
    parser.add_argument("--title", type=str, required=True, help="Episode title")
    parser.add_argument("--description", type=str, default="", help="Description")
    parser.add_argument("--file", type=str, required=True, help="Path to local MP4")
    parser.add_argument("--duration", type=float, default=26.67, help="Video duration in seconds")
    parser.add_argument("--caption", type=str, default="", help="Instagram caption")
    parser.add_argument("--hashtags", type=str, default="#100daysoffreeai #opensource #aitools #freedevtools", help="Hashtags")
    parser.add_argument("--cta", type=str, default="Comment FREE for the direct setup guide!", help="Call to action")
    parser.add_argument("--keywords", type=str, default="Open Source AI,Harshith and Claude", help="Comma-separated keywords")
    args = parser.parse_args()

    filename = os.path.basename(args.file)
    remote_filename = f"day-{args.episode:02d}-{filename.lower().replace('_', '-')}"
    
    public_url, file_size = upload_video(args.file, remote_filename)
    
    payload = {
        "user_id": "dc04941d-2849-4fd1-9a82-4e9fd18a0296",
        "title": args.title,
        "episode_number": args.episode,
        "series_name": "100 Days of Free AI",
        "description": args.description or args.title,
        "storage_path": public_url,
        "thumbnail_path": None,
        "file_name": filename,
        "file_size": file_size,
        "duration_seconds": args.duration,
        "resolution": "1080 × 1920",
        "mime_type": "video/mp4",
        "caption": args.caption,
        "hashtags": args.hashtags,
        "pinned_comment": f"Want the instant setup guide? Comment FREE and Claude will DM you the exact link.",
        "cta": args.cta,
        "topic_keywords": [k.strip() for k in args.keywords.split(",") if k.strip()],
        "status": "Ready",
    }
    
    upsert_database(payload)
    print("Done! Episode is live on the dashboard.")

if __name__ == "__main__":
    main()
