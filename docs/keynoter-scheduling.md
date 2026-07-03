# Keynoter Social Media Scheduling

This document describes the process for scheduling keynote speaker announcement
posts to Buffer. In short, you should:

- prepare the images in canva and deploy them to have a live url to the image
- prepare copy for each platform and put it into a json file
- run the script to schedule posts for the keynoters, one at a time, to all the
  supported social media platform

The script posts to all connected channels in one run per keynoter: `instagram`,
`linkedin`, `fosstodon`, `bsky`, `x`, `tiktok`.

---

## Prerequisites

- Python environment with `requests` and `python-dotenv` installed
- A `.env.local` file in the **repo root** with your Buffer API key:

```
BUFFER_API_KEY=your_buffer_api_key_here
```

### Getting the Buffer API key

1. Log in to [buffer.com](https://buffer.com) with the EuroPython account
2. Go to **Account Settings → Apps & Integrations**
3. Copy the personal access token under **Access Token**
4. Paste it as `BUFFER_API_KEY` in `.env.local`

---

## Step 1 — Prepare and deploy the images

Buffer requires a **publicly accessible image URL** — local file paths, Google
Drive links, and Canva share links do not work. The image must be hosted on the
live site before the script can use it.

### Prepare the images

- Export images as PNG from your design tool (Canva)
- Name them `firstname-lastname.png` (lowercase, hyphenated)
- Place them in `website/public/media/keynoters/`

### Deploy

1. Commit the images and open a PR
2. Wait for the PR to be merged and deployed to production
3. Verify each image is accessible, e.g.:
   `https://ep2026.europython.eu/media/keynoters/leah-wasser.png`

> ⚠️ Do not run the scheduling script until the images are live. Buffer fetches
> the URL at scheduling time and will fail with a "Not Found" error if the file
> hasn't been deployed yet.

## Step 2 — Prepare the post copy (`keynoters.json`)

All post text lives in `scripts/keynoters.json`

```json
{
  "Speaker Name": {
    "image": "https://ep<year>.europython.eu/media/keynoters/firstname-lastname.png",
    "instagram": "Post text for Instagram...",
    "linkedin": "Post text for LinkedIn...",
    "fosstodon": "Post text for Fosstodon/Mastodon...",
    "bsky": "Post text for Bluesky...",
    "x": "Post text for X/Twitter...",
    "tiktok": "Post text for TikTok..."
  }
}
```

A few things to keep in mind when writing copy:

- Social handles (e.g. `@leahawasser.bsky.social`) go **inline in the post
  text**, not as separate fields. Each platform's post should use the handle
  format native to that platform.
- X and Bluesky have character limits — keep those posts short.
- Instagram and TikTok don't render clickable URLs, so use the short form
  (`europython.eu/tickets/`) rather than the full URL.
- LinkedIn and Fosstodon support full clickable URLs.

Add one entry per keynoter. The key must match exactly what you'll set in the
script in Step 3.

---

## Step 3 — Schedule posts via Buffer

The scheduling script is `scripts/buffer-keynoters.py`. Run it once per
keynoter.

### Configure the script

Open `scripts/buffer-keynoters.py` and edit the two lines at the top:

```python
KEYNOTER     = "Leah Wasser"           # must match the key in keynoters.json exactly
SCHEDULED_AT = datetime(2026, 6, 16, 10, 0,
                        tzinfo=ZoneInfo("Europe/London"))
```

Set `SCHEDULED_AT` to the date and time you want the post to go live. The
timezone is `Europe/London` — adjust the year, month, day, hour, and minute as
needed.

### Preview before posting

```bash
python scripts/buffer-keynoters.py --dry-run
```

This prints the first 200 characters of the post for each platform without
sending anything to Buffer. Use it to sanity-check the copy and confirm the
right keynoter is selected.

### Run

```bash
python scripts/buffer-keynoters.py
```

The script will:

1. Connect to Buffer and fetch your channel IDs
2. Fetch the image from the live URL in `keynoters.json`
3. Schedule the post to every platform that has text defined
4. Skip any platform not connected in your Buffer account
5. Print a confirmation line with the Buffer post ID for each channel

Repeat for each keynoter, updating `KEYNOTER` and `SCHEDULED_AT` each time.

---

## Troubleshooting

| Error                               | Cause                        | Fix                                              |
| ----------------------------------- | ---------------------------- | ------------------------------------------------ |
| `BUFFER_API_KEY not set`            | Missing `.env.local`         | Create `website/.env.local` with the key         |
| `Image upload failed (404)`         | Image not deployed yet       | Merge the images PR and wait for deployment      |
| `not connected in Buffer — skipped` | Channel not linked in Buffer | Log in to Buffer and connect the missing channel |
| `not found in keynoters.json`       | Typo in `KEYNOTER`           | Check the exact key spelling in `keynoters.json` |
