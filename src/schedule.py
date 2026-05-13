"""Process raw schedule data into structured schedule days."""

from collections import defaultdict
from datetime import datetime

from models import (
    LunchEvent,
    ScheduleDay,
    ScheduleEntry,
    ScheduleEvent,
    ScheduleSlot,
    Session,
)

TALK_DAYS = {"2025-07-16", "2025-07-17", "2025-07-18"}

_SPANNING_TYPES = {"Keynote", "Announcements"}
_HIDDEN_ROOMS = {"Exhibit Hall"}
_LUNCH_EVENTS: dict[str, list[LunchEvent]] = {
    "2025-07-17": [LunchEvent("PyLadies Lunch", "/programme/#pyladies")],
    "2025-07-18": [LunchEvent("Conference Organisers Summit", "/programme/#orgsummit")],
}


def build_schedule(raw: dict, sessions: dict[str, Session]) -> list[ScheduleDay]:
    """Build structured schedule days from raw schedule data and resolved sessions."""
    if not raw:
        return []

    days = []
    for date_str in sorted(TALK_DAYS):
        day_data = raw.get("days", {}).get(date_str)
        if not day_data:
            continue

        rooms = [r for r in day_data["rooms"] if r not in _HIDDEN_ROOMS]
        rooms_set = set(rooms)
        all_events = [ScheduleEvent(**e) for e in day_data["events"]]
        events = _filter_events(all_events, rooms_set)
        slots = _build_slots(events, all_events, rooms, rooms_set, sessions)

        lunch_events = _LUNCH_EVENTS.get(date_str, [])
        if lunch_events:
            for slot in slots:
                for entry in slot.entries:
                    if entry and entry.is_break and "lunch" in entry.break_title.lower():
                        entry.lunch_events = lunch_events

        label, short_label, day_id = _day_label(date_str)

        days.append(
            ScheduleDay(
                date=date_str,
                label=label,
                short_label=short_label,
                day_id=day_id,
                rooms=rooms,
                slots=slots,
            )
        )

    return days


def _day_label(date_str: str) -> tuple[str, str, str]:
    """Derive display labels from a date string like '2025-07-16'."""
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    label = dt.strftime("%A, %B %d").replace(" 0", " ")
    short_label = dt.strftime("%a")
    day_id = short_label.lower()
    return label, short_label, day_id


def _filter_events(events: list[ScheduleEvent], rooms_set: set[str]) -> list[ScheduleEvent]:
    """Keep events that involve at least one of the day's rooms."""
    return [e for e in events if any(r in rooms_set for r in e.rooms)]


def _is_spanning(event: ScheduleEvent, events_at_time: list[ScheduleEvent], rooms_set: set[str]) -> bool:
    """Determine if an event should span all columns."""
    if event.is_break:
        return True

    if (event.session_type or "") in _SPANNING_TYPES:
        room_events = [e for e in events_at_time if any(r in rooms_set for r in e.rooms) and not e.is_break]
        distinct_titles = {e.title for e in room_events}
        return len(distinct_titles) == 1

    return False


def _make_entry(
    event: ScheduleEvent,
    sessions: dict[str, Session],
    posters: list | None = None,
) -> ScheduleEntry:
    """Create a ScheduleEntry, using the loaded Session when available."""
    session = sessions.get(event.code) if event.code else None

    if session:
        return ScheduleEntry(
            session=session,
            time=session.start_time,
            end_time=session.end_time,
            is_break=False,
        )

    return ScheduleEntry(
        session=None,
        time=event.time,
        end_time=event.end_time,
        is_break=event.is_break,
        break_title=event.title,
        break_duration=event.duration,
        posters=posters or [],
    )


def _posters_at_time(all_events: list[ScheduleEvent], time_key: str, sessions: dict[str, Session]) -> list[Session]:
    """Collect poster sessions from hidden rooms at a given time."""
    posters = []
    for e in all_events:
        if (
            e.time == time_key
            and e.session_type == "Poster"
            and any(r in _HIDDEN_ROOMS for r in e.rooms)
            and e.code
            and e.code in sessions
        ):
            posters.append(sessions[e.code])
    posters.sort(key=lambda s: s.title)
    return posters


def _build_slots(
    events: list[ScheduleEvent],
    all_events: list[ScheduleEvent],
    rooms: list[str],
    rooms_set: set[str],
    sessions: dict[str, Session],
) -> list[ScheduleSlot]:
    """Group events into time slots."""
    by_time: defaultdict[str, list[ScheduleEvent]] = defaultdict(list)
    for e in events:
        by_time[e.time].append(e)

    slots = []
    for time_key in sorted(by_time.keys()):
        time_events = by_time[time_key]

        spanning_event = None
        for e in time_events:
            if _is_spanning(e, time_events, rooms_set):
                spanning_event = e
                break

        if spanning_event:
            posters = _posters_at_time(all_events, time_key, sessions) if spanning_event.is_break else []
            entry = _make_entry(spanning_event, sessions, posters)
            slots.append(
                ScheduleSlot(
                    start_time=time_key,
                    entries=[entry],
                    is_spanning=True,
                )
            )
        else:
            room_map: dict[str, ScheduleEntry] = {}
            for e in time_events:
                for room in e.rooms:
                    if room in rooms_set:
                        room_map[room] = _make_entry(e, sessions)

            slots.append(
                ScheduleSlot(
                    start_time=time_key,
                    entries=[room_map.get(r) for r in rooms],
                    is_spanning=False,
                )
            )

    return slots
