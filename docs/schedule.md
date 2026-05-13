# Schedule Page

The schedule page (`schedule.html`) shows the 3 main conference talk days
(Wed-Fri, July 16-18) as a server-side rendered static grid.

## Data source

- `data/schedule.json` — downloaded by the data script
- Contains all days (Mon-Sun), all rooms, all event types
- We filter to 3 talk days and 6 talk rooms only

## Backend (`src/schedule.py`)

### Public API

`load_schedule(data_dir: Path) -> list[ScheduleDay]`

Returns an empty list if `schedule.json` doesn't exist, so the build never fails.

### Processing pipeline

1. Read `schedule.json`, iterate over the 3 talk day dates
2. **Filter events**: keep only events that have at least one room in `TALK_ROOMS`
3. **Group by start time**: events are bucketed by their HH:MM start time
4. **Spanning detection**: determine if a time slot spans all columns (full-width row)
5. **Build entries**: for non-spanning slots, create one entry per room (or None if empty)
6. **Format times**: ISO 8601 timestamps are converted to "HH:MM" strings

### 6 talk rooms (in display order)

```
Forum Hall, North Hall, South Hall 2A, South Hall 2B, Terrace 2A, Terrace 2B
```

### Spanning detection

A time slot becomes a full-width spanning row when:

- The event's `event_type == "break"` (coffee breaks, lunch), OR
- The event's `session_type` is "Keynote" or "Announcements" AND it is the only
  distinct event at that start time across talk rooms

Keynotes and lightning talks happen in Forum Hall only but are displayed spanning
all columns. The room name ("Forum Hall") is shown in the meta line so
participants know where to go.

### Session type display labels

Some types are redundant and hidden (the label is set to empty string):

- **Hidden**: "Talk", "Talk (long session)", "Sponsored" — these are the default,
  no label needed
- **Shown**: "Keynote", "Break", "Panel", "Announcements", "Documentary and Q&A"

This logic lives in `_display_session_type()` so templates just check
`if entry.session_type` with no extra logic.

### Data models (`src/models.py`)

```
ScheduleEntry   — one talk/event in one room
ScheduleSlot    — one time row: either a spanning entry or per-room entries
ScheduleDay     — one day: date, labels, room list, list of slots
```

## Frontend

### Templates

- `src/templates/pages/schedule.html` — page wrapper (extends base, breadcrumb, includes block)
- `src/templates/blocks/_schedule.html` — the actual schedule grid

### Template structure

1. Header: title, subtitle, "see also" card grid (tutorials, open spaces, sprints, EuroSciPy)
2. Day tabs: Wed / Thu / Fri buttons with `data-day` attribute
3. Per-day container (first day active, rest hidden):
   - Room headers row (desktop only, 7-column grid: time + 6 rooms)
   - Time slots, each either:
     - **Spanning row**: time + single full-width entry (breaks, keynotes)
     - **Normal row**: time + 6 cells (one per room, may be empty)
4. Entry cards show: type label (if not hidden), title (linked), speakers, meta (room + duration)

Template uses only: for loops, simple if/endif on booleans/None, attribute access.
No computation in Jinja.

### CSS (`style.css`, `.sched-*` classes)

**Desktop layout**: CSS Grid `grid-template-columns: 70px repeat(6, 1fr)`

- Room headers row is sticky below nav
- Spanning rows use `grid-template-columns: 70px 1fr`
- Cards have translucent background with hover highlight
- Break rows have a warm amber tint

**Background**: diagonal gradient (deep navy tones) with evenly spaced dot pattern
(24px grid, subtle white dots via radial-gradient).

**Mobile (<900px)**:
- Room headers hidden
- Grid becomes single-column flex
- Empty cells hidden
- Time shown as section divider
- Each card shows room name in meta

### JavaScript (`script.js`)

~15 lines: click handler on `.sched-tab` buttons toggles `.sched-day--active`
and `.sched-tab--active` classes. First day is visible without JS (progressive
enhancement via CSS class set in template).

## Build integration

`src/build.py` imports `load_schedule` and adds `schedule_days` to the template
context. Works in both paths (with and without speakers/sessions data).

## Menu

`src/menu.py`: `L.schedule` points to `schedule.html` (was `programme.html#programme`).
This propagates to both nav and footer since they reference `L.schedule`.
