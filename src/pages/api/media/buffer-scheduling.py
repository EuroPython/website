import requests
import json
import time
import os

# Load .env.local if present (for local development)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "../../../../.env.local"))
except ImportError:
    pass  # dotenv not installed, rely on environment variables being set externally

# ==========================================
# 1. CONFIGURATION
# ==========================================
API_KEY = os.environ.get("BUFFER_API_KEY")
if not API_KEY:
    raise EnvironmentError("BUFFER_API_KEY environment variable is not set.")
URL = "https://api.buffer.com/"

# ==========================================
# QUEUE RANGE (1-based, inclusive)
# Edit these two numbers to pick which items
# from queue.json to schedule.
# ==========================================
QUEUE_START = 5   # first item to schedule
QUEUE_END   = 5  # last item to schedule (inclusive)

# ==========================================
# LOAD ITEMS FROM queue.json
# ==========================================
queue_path = os.path.join(os.path.dirname(__file__), "combined_socials_queue.json")
with open(queue_path, encoding="utf-8") as f:
    full_queue = json.load(f)

data_payload = full_queue[QUEUE_START - 1 : QUEUE_END]

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# ==========================================
# 2. DYNAMICALLY FETCH PROFILE CHANNEL IDs
# ==========================================
print("🔄 Connecting to Buffer to fetch channel metadata...")

get_channels_query = """
query GetAllChannels {
  account {
    organizations {
      channels {
        id
        service
      }
    }
  }
}
"""

response = requests.post(URL, json={"query": get_channels_query}, headers=headers)
if response.status_code != 200 or "errors" in response.json():
    print("❌ Failed to retrieve profiles. Verify your API key.")
    exit()

# Map the fetched network profiles into a lookup dictionary
profile_map = {}
organizations = response.json()["data"]["account"]["organizations"]
for org in organizations:
    for channel in org["channels"]:
        service_name = channel["service"].lower()
        if service_name == "twitter":
            service_name = "x"
        elif service_name == "mastodon":
            service_name = "fosstodon"
        elif service_name == "bluesky":
            service_name = "bsky"
        profile_map[service_name] = channel["id"]

print("✅ Found profiles mapping layout directly from Buffer:")
print(json.dumps(profile_map, indent=2))
print("-" * 60)

# ==========================================
# 3. CONSTRUCT & RUN MUTATION PIPELINE
# ==========================================
create_post_mutation = """
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post {
        id
      }
    }
    ... on MutationError {
      message
    }
  }
}
"""

print(f"🚀 Starting dynamic upload sequence of {len(data_payload)} items (queue positions {QUEUE_START}–{QUEUE_END})...")

for index, item in enumerate(data_payload, start=1):
    queue_pos = QUEUE_START + index - 1
    print(f"\n📦 Processing [{index}/{len(data_payload)}] (queue #{queue_pos}): {item['name']}")

    if "channel" not in item:
        print(f"  ⚠️ Skipped — no channel data found for this item.")
        continue

    for network, text in item["channel"].items():
        if not text:
            continue

        profile_id = profile_map.get(network)
        if not profile_id:
            print(f"  ⚠️ Skipped [{network}] - Channel profile not connected in Buffer dashboard.")
            continue

        variables = {
            "input": {
                "channelId": profile_id,
                "text": text,
                "schedulingType": "automatic",
                "mode": "addToQueue",
                "assets": [{"image": {"url": item["image"]}}] if item.get("image") else [],
                **({"metadata": {"instagram": {"type": "post", "shouldShareToFeed": True}}} if network == "instagram" else {})
            }
        }

        post_response = requests.post(
            URL,
            json={"query": create_post_mutation, "variables": variables},
            headers=headers
        )

        if post_response.status_code == 200:
            res_json = post_response.json()
            if "errors" in res_json:
                print(f"  ❌ GraphQL Error on [{network}]: {res_json['errors'][0]['message']}")
            else:
                create_post_result = res_json.get("data", {}).get("createPost", {})
                if create_post_result.get("__typename") == "MutationError" or "message" in create_post_result:
                    print(f"  ❌ Failed [{network}]: {create_post_result.get('message', 'Unknown error')}")
                elif create_post_result.get("post", {}).get("id"):
                    print(f"  ✅ Scheduled into next available [{network}] FIFO queue slot. (post id: {create_post_result['post']['id']})")
                else:
                    print(f"  ⚠️ Unexpected response for [{network}]: {json.dumps(create_post_result)}")
        else:
            print(f"  ❌ Server Error on [{network}]: Status code {post_response.status_code}")
            print(f"  🔍 Response body: {post_response.text}")

    time.sleep(1.5)

print("\n🎉 All tasks processed successfully!")
