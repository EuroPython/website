"""
Buffer scheduling script for EP 2026 Keynoter announcements.
Run once per keynoter — edit KEYNOTER and SCHEDULED_AT below, then run.

Usage:
    python buffer-keynoters.py
    python buffer-keynoters.py --dry-run

Requires: pip install requests python-dotenv
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from zoneinfo import ZoneInfo

import requests

try:
    from dotenv import load_dotenv
    repo_root = subprocess.check_output(
        ["git", "rev-parse", "--show-toplevel"], stderr=subprocess.DEVNULL
    ).decode().strip()
    load_dotenv(os.path.join(repo_root, ".env.local"))
except (ImportError, subprocess.CalledProcessError):
    pass

# ==========================================
# EDIT THESE TWO LINES BEFORE EACH RUN
# ==========================================
KEYNOTER     = "Leah Wasser"                    # must match a key in keynoters.json
SCHEDULED_AT = datetime(2026, 6, 16, 9, 0,     # year, month, day, hour, minute
                        tzinfo=ZoneInfo("Europe/London"))
# ==========================================

API_KEY = os.environ.get("BUFFER_API_KEY")
if not API_KEY:
    print("ERROR: BUFFER_API_KEY not set. Add it to website/.env.local or export it.")
    sys.exit(1)

BUFFER_URL = "https://api.buffer.com/"
HEADERS    = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

parser = argparse.ArgumentParser()
parser.add_argument("--dry-run", action="store_true", help="Preview without posting")
args = parser.parse_args()

# ==========================================
# LOAD KEYNOTER DATA
# ==========================================
queue_path = os.path.join(os.path.dirname(__file__), "keynoters.json")
with open(queue_path, encoding="utf-8") as f:
    all_keynoters = json.load(f)

if KEYNOTER not in all_keynoters:
    print(f"ERROR: '{KEYNOTER}' not found in keynoters.json")
    print(f"   Available: {', '.join(all_keynoters.keys())}")
    sys.exit(1)

data      = all_keynoters[KEYNOTER]
image_url  = data.get("image")
channels  = {k: v for k, v in data.items() if k != "image"}
sched_unix = int(SCHEDULED_AT.timestamp())

print(f"Keynoter:  {KEYNOTER}")
print(f"Scheduled: {SCHEDULED_AT.strftime('%Y-%m-%d %H:%M %Z')}")
print(f"Image:     {image_url or 'none'}")
if args.dry_run:
    print("DRY RUN — nothing will be sent\n")
    for network, text in channels.items():
        print(f"[{network.upper()}]")
        print(text[:200] + ("..." if len(text) > 200 else ""))
        print()
    sys.exit(0)

# ==========================================
# FETCH BUFFER CHANNEL IDs
# ==========================================
get_channels_query = """
query { account { organizations { channels { id service } } } }
"""
resp = requests.post(BUFFER_URL, json={"query": get_channels_query}, headers=HEADERS)
if resp.status_code != 200 or "errors" in resp.json():
    print(f"ERROR: Could not fetch Buffer channels: {resp.text}")
    sys.exit(1)

SERVICE_MAP = {"twitter": "x", "mastodon": "fosstodon", "bluesky": "bsky"}
profile_map = {}
for org in resp.json()["data"]["account"]["organizations"]:
    for ch in org["channels"]:
        key = SERVICE_MAP.get(ch["service"].lower(), ch["service"].lower())
        profile_map[key] = ch["id"]

print("Connected channels:", list(profile_map.keys()))
print("-" * 50)

# ==========================================
# POST TO EACH CHANNEL
# ==========================================
create_mutation = """
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess { post { id scheduledAt } }
    ... on MutationError { message }
  }
}
"""

for network, text in channels.items():
    profile_id = profile_map.get(network)
    if not profile_id:
        print(f"  [{network}] not connected in Buffer — skipped")
        continue

    post_input = {
        "channelId":     profile_id,
        "text":          text,
        "schedulingType": "scheduled",
        "mode":          "scheduled",
        "scheduledAt":   sched_unix,
    }
    if image_url:
        post_input["assets"] = [{"image": {"url": image_url, "metadata": {"altText": KEYNOTER}}}]
    if network == "instagram":
        post_input["metadata"] = {"instagram": {"type": "post", "shouldShareToFeed": True}}
    elif network == "tiktok":
        post_input["metadata"] = {"tiktok": {"title": KEYNOTER}}

    resp = requests.post(
        BUFFER_URL,
        json={"query": create_mutation, "variables": {"input": post_input}},
        headers=HEADERS,
    )
    if resp.status_code == 200:
        res_json = resp.json()
        if "errors" in res_json:
            print(f"  [{network}] GraphQL error: {res_json['errors'][0]['message']}")
        else:
            res  = res_json.get("data", {}).get("createPost", {})
            post = res.get("post", {})
            if post.get("id"):
                print(f"  [{network}] scheduled at {post.get('scheduledAt')} (id: {post['id']})")
            else:
                print(f"  [{network}] failed: {res.get('message', 'unknown error')}")
    else:
        print(f"  [{network}] HTTP {resp.status_code}: {resp.text}")

    time.sleep(0.5)

print("\nDone.")
