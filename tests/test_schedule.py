"""Tests for schedule module."""

import pytest

from models import ScheduleEvent
from schedule import _day_label, _filter_events, _is_spanning

# --- _day_label ---


@pytest.mark.parametrize(
    "date_str, expected_label, expected_short, expected_id",
    [
        ("2025-07-16", "Wednesday, July 16", "Wed", "wed"),
        ("2025-07-17", "Thursday, July 17", "Thu", "thu"),
        ("2025-07-18", "Friday, July 18", "Fri", "fri"),
    ],
)
def test_day_label(date_str, expected_label, expected_short, expected_id):
    label, short_label, day_id = _day_label(date_str)

    assert label == expected_label
    assert short_label == expected_short
    assert day_id == expected_id


# --- _is_spanning ---


def _make_event(**overrides) -> ScheduleEvent:
    from datetime import datetime

    defaults = {
        "event_type": "session",
        "session_type": "Talk",
        "rooms": ["Room A"],
        "title": "A talk",
        "start": datetime(2025, 7, 16, 10, 0),
        "duration": 30,
    }
    defaults.update(overrides)
    return ScheduleEvent(**defaults)


def test_is_spanning_break():
    event = _make_event(event_type="break", title="Coffee Break")
    rooms = {"Room A", "Room B"}

    assert _is_spanning(event, [event], rooms) is True


def test_is_spanning_keynote_single():
    event = _make_event(session_type="Keynote", title="Opening Keynote", rooms=["Room A"])
    rooms = {"Room A", "Room B"}

    assert _is_spanning(event, [event], rooms) is True


def test_is_spanning_regular_talk():
    event = _make_event(session_type="Talk", title="My Talk")
    rooms = {"Room A", "Room B"}

    assert _is_spanning(event, [event], rooms) is False


def test_is_spanning_keynote_with_different_parallel():
    keynote = _make_event(session_type="Keynote", title="Opening Keynote", rooms=["Room A"])
    other = _make_event(session_type="Talk", title="Different Talk", rooms=["Room B"])
    rooms = {"Room A", "Room B"}

    assert _is_spanning(keynote, [keynote, other], rooms) is False


# --- _filter_events ---


def test_filter_events_keeps_matching_rooms():
    e1 = _make_event(rooms=["Room A"])
    e2 = _make_event(rooms=["Room B"])
    e3 = _make_event(rooms=["Hidden Room"])
    rooms = {"Room A", "Room B"}

    result = _filter_events([e1, e2, e3], rooms)

    assert len(result) == 2
    assert e1 in result
    assert e2 in result


def test_filter_events_empty():
    e1 = _make_event(rooms=["Hidden Room"])
    rooms = {"Room A"}

    result = _filter_events([e1], rooms)

    assert result == []
