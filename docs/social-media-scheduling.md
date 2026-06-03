# Social Media Scheduling

This document describes the end-to-end process for generating social media cards
and scheduling posts for EuroPython 2026 speakers, sponsors, and community
partners via Buffer.

---

## Overview

The pipeline has three stages:

1. **Generate social card images** — render PNG cards for speakers and sponsors
   using Puppeteer
2. **Generate the post queue** — hit the Astro API endpoint to produce
   `queue.json`
3. **Schedule posts to Buffer** — run the Python script to push items from the
   queue

---

## Prerequisites

- Dev server running locally (`pnpm dev`, default port `4321`)
- Node.js + pnpm installed
- Python environment with dependencies: `requests`, `python-dotenv`
- A `.env.local` file in the project root with your Buffer API key:

```
BUFFER_API_KEY=your_buffer_api_key_here
```

This file is gitignored and never committed.

### Getting the Buffer API key

1. Log in to [buffer.com](https://buffer.com) with the EuroPython account
2. Go to **Account Settings** → **Apps & Integrations** (or navigate directly to
   https://account.buffer.com/apps)
3. Under **Access Token**, copy your personal access token
4. Paste it as the value of `BUFFER_API_KEY` in your `.env.local`

---

## Step 1 — Generate Social Card Images

Social cards are 900×900px PNG images rendered from Astro pages and
screenshotted with Puppeteer.

### Speaker cards

Speaker cards are generated per-session. Speakers with multiple qualifying
sessions (Talk, Tutorial, or other session types) get one card per session,
named `social-${slug}-${sessionCode}.png`. Single-session speakers get the
standard `social-${slug}.png`.

```bash
node scripts/download_social_speakers.cjs
```

Screenshots are saved to the current directory. Move them to the right place:

```bash
mv social-*.png public/media/speakers/
```

When regenerating, skip files that already exist to avoid overwriting images for
speakers whose posts are already scheduled. If a speaker previously had one
session and now has a second, delete the old generic `social-${slug}.png` after
the per-session images are committed.

### Sponsor & partner cards

```bash
node scripts/download_social_sponsors.cjs
```

Move them:

```bash
mv social-*.png public/media/sponsors/
```

> The scripts read from `http://localhost:4321/media/speakers` and
> `http://localhost:4321/media/sponsors` respectively, so the dev server must be
> running.

### Checking for missing images

Cross-reference the live site with what's in `public/media/sponsors/`. Every
sponsor and partner listed on:

- https://ep2026.europython.eu/sponsors/
- https://ep2026.europython.eu/community-partners/

should have a corresponding `social-<slug>.png` in `public/media/sponsors/`.

---

## Step 2 — Generate the Post Queue

The queue is a JSON file that interleaves speakers, sponsors, and community
partners in a repeating pattern:

```
speaker → speaker → sponsor → speaker → partner → (repeat)
```

Regenerate it by hitting the API endpoint while the dev server is running:

```bash
curl -s http://localhost:4321/api/media/combined_socials_queue > src/pages/api/media/combined_socials_queue.json
```

This overwrites `src/pages/api/media/combined_socials_queue.json` with all
items sorted and interleaved.

> **Note:** There are two queue files:
> - `combined_socials_queue.json` — the freshly generated queue, used as the
>   source of truth and read by `buffer-scheduling.py`
> - `combined_socials_queue_2026.json` — the manually curated queue that
>   preserves already-scheduled posts at the top; new entries are appended after
>   the last scheduled position

When new speakers or sponsors are added, regenerate `combined_socials_queue.json`
and then merge the new entries into `combined_socials_queue_2026.json` manually —
keeping already-posted entries intact and appending only new/unposted ones.

### Session types and labels

The queue includes all qualifying session types — not just talks and tutorials.
The label used in post text is determined by session type:

- `"Talk"` / `"Talk (long session)"` → `"talk"`
- `"Tutorial"` → `"tutorial"`
- Everything else (Poster, Summit, etc.) → `"session"`

Speakers with multiple qualifying sessions get one queue entry per session,
each with its own per-session card image.

### Tier classification

Sponsors are split into two buckets:

- **Commercial** (go into the sponsor slot): Keystone, Diamond, Platinum,
  Platinum X, Gold, Silver, Bronze, Patron
- **Community partners** (go into the partner slot): Partners, Supporters,
  Financial Aid

If a new sponsor tier is added, update `commercialTiers` in
`src/pages/api/media/combined_socials_queue.ts`.

### Manual queue adjustments

You can edit `src/pages/api/media/combined_socials_queue.json` directly to
reorder entries. For example, to swap two sponsors:

```python
python3 -c "
import json
path = 'src/pages/api/media/combined_socials_queue.json'
with open(path) as f:
    q = json.load(f)
q[2], q[17] = q[17], q[2]  # swap positions 3 and 18 (0-indexed)
with open(path, 'w') as f:
    json.dump(q, f, indent=2, ensure_ascii=False)
"
```

`src/pages/api/media/combined_socials_queue.json` is committed to the repo. Any
manual reordering should be committed so the intentional order is preserved and
not lost when the queue is regenerated.

---

## Step 3 — Commit and Merge Images

Before scheduling, the social card images need to be live on the production
site. Buffer fetches the image URL at scheduling time and will fail with
`Failed to fetch image dimensions: Not Found` if the file isn't deployed yet.

1. Stage the new images:

```bash
git add public/media/speakers/ public/media/sponsors/
```

2. Commit:

```bash
git commit -m "Add social media cards for speakers/sponsors"
```

3. Push to a branch and open a PR:

```bash
git push -u origin your-branch-name
gh pr create --title "Add social media cards" --body "New speaker and sponsor social card PNGs for Buffer scheduling."
```

4. Wait for the PR to be merged and deployed before proceeding to Step 4.

You can verify the images are live by checking a URL like:
`https://ep2026.europython.eu/media/sponsors/social-arm.png`

---

## Step 4 — Schedule Posts via Buffer

> ⚠️ **Images must be live before scheduling.** Buffer fetches the image URL at
> scheduling time. If the PNG hasn't been deployed yet (i.e. the PR adding it
> hasn't been merged and deployed), Buffer will fail with
> `Failed to fetch image dimensions: Not Found`. Always merge and confirm the
> images are live at `https://ep2026.europython.eu/media/speakers/` or
> `https://ep2026.europython.eu/media/sponsors/` before running the script.

### How Buffer scheduling works

Buffer operates as a FIFO queue against pre-configured time slots:

- Time slots are defined per channel inside Buffer (e.g. "Twitter, weekdays at
  09:00 and 14:00").
- Incoming posts fill the next available slot in order — you don't pick a
  specific date/time.
- Slots can be added or shifted directly in Buffer if you need to change the
  cadence.

> ⚠️ **Check your Buffer slots before running the script.** If you push 120
> cards and there is only one slot per day per channel, you'll end up with posts
> queued months out — and there is no bulk deletion in Buffer, so you'd have to
> remove them one by one. Before each run, open Buffer and verify the number and
> cadence of slots for each channel matches your intended rollout pace.

The scheduling script is at `src/pages/api/media/buffer-scheduling.py`.

### Configuration

Open the script and set the range of queue items to schedule:

```python
QUEUE_START = 1   # first item (1-based, inclusive)
QUEUE_END   = 5   # last item (1-based, inclusive)
```

It's a good idea to start with a small batch (e.g. 1–5) to verify everything
looks correct in Buffer before pushing the full queue. Once you're happy with
the results, increment the range for subsequent runs.

### Running the script

```bash
uv run python src/pages/api/media/buffer-scheduling.py
```

Or with your venv activated:

```bash
python src/pages/api/media/buffer-scheduling.py
```

### What it does

1. Connects to Buffer and fetches your channel profile IDs
2. Iterates over the selected queue items
3. For each item, posts to every channel that has text defined (`instagram`,
   `x`, `linkedin`, `bsky`, `fosstodon`)
4. Skips channels with empty text or no matching Buffer profile
5. Adds Instagram-specific metadata (`postType: post`) automatically
6. Waits 1.5 seconds between items to respect rate limits

### Channel notes

- **Instagram**: requires `postType: post` — handled automatically
- **TikTok**: supports photo posts with an optional `title` (set to the speaker
  name) — handled automatically
- **Sponsors/partners**: no Instagram or TikTok channel (only x, linkedin, bsky,
  fosstodon)
- **Speakers**: all 6 channels including Instagram and TikTok
- **Bluesky**: Buffer returns this as `"bluesky"` — normalized to `"bsky"`
  automatically

### Tracking progress

After each successful run, note the last `QUEUE_END` value. The next run should
set `QUEUE_START = previous QUEUE_END + 1`.

The script reads from `combined_socials_queue.json` by default. When switching
to the curated `combined_socials_queue_2026.json`, update `queue_path` in the
script accordingly.

Already scheduled as of June 2026:

- Positions 1–67 in `combined_socials_queue_2026.json` (up to and including
  PyGda partner post)

Next batch starts at position 68 (Giovanni Barillari).

---

## Troubleshooting

| Error                                         | Cause                           | Fix                                                        |
| --------------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| `BUFFER_API_KEY not set`                      | Missing `.env.local`            | Create `.env.local` with the key                           |
| `Failed to fetch image dimensions: Not Found` | Image not deployed yet          | Generate and commit the missing PNG first                  |
| `Field "postType" is not defined`             | Wrong field placement           | `postType` goes inside `metadata.instagram`, not top-level |
| `Channel profile not connected`               | Service name mismatch           | Check the normalization block in the script                |
| `KeyError: 'channel'`                         | Queue item missing channel data | Re-run `curl .../queue > queue.json` to regenerate         |
