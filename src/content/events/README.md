# Side Events

Each `.md` file in this directory is one event on the `/schedule/events` page.

## Required fields

```yaml
title: "Event Name"
date: "2026-07-13" # ISO date — determines which day group it appears under
description: "One or two sentences shown on the card."
```

## Optional fields

```yaml
date_end: "2026-07-14" # for multi-day events; shows a date range instead of a single date
time_start: "09:00"
time_end: "17:00"
location: "ICE Kraków Congress Centre, Hall B"
url: /your-page # internal path or full URL; adds a "Full details" link
draft: true # hides the event in production builds
```

## Example

```yaml
---
title: PyLadies Lunch
date: "2026-07-15"
time_start: "13:00"
time_end: "14:30"
location: "Room TBA"
url: /pyladies
description: An informal lunch for PyLadies members and allies. All welcome.
---
```

Drop the file, push — done. The page re-sorts by date and time automatically.
