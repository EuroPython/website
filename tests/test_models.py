"""Tests for models module."""

from datetime import datetime

import pytest

from models import Session, Speaker, _slugify

# --- _slugify ---


@pytest.mark.parametrize(
    "text, expected",
    [
        ("Machine Learning", "machine-learning"),
        ("Hello   World", "hello-world"),
        ("  leading-trailing  ", "leading-trailing"),
        ("Special!@#Characters", "special-characters"),
        ("already-slugified", "already-slugified"),
        ("UPPERCASE", "uppercase"),
        ("one", "one"),
        ("", ""),
    ],
)
def test_slugify(text, expected):
    assert _slugify(text) == expected


# --- Speaker ---


def test_speaker_url():
    spk = Speaker(code="ABC", name="Ada Lovelace", slug="ada-lovelace")

    assert spk.url == "/speaker/ada-lovelace/"


# --- Session properties ---


def _make_session(**overrides) -> Session:
    defaults = {"code": "X1", "title": "Test"}
    defaults.update(overrides)
    return Session(**defaults)


def test_session_url():
    s = _make_session(slug="my-talk")

    assert s.url == "/session/my-talk/"


def test_session_start_time():
    s = _make_session(start=datetime(2025, 7, 16, 14, 30))

    assert s.start_time == "14:30"


def test_session_start_time_none():
    s = _make_session(start=None)

    assert s.start_time == ""


def test_session_end_time():
    s = _make_session(end=datetime(2025, 7, 16, 15, 0))

    assert s.end_time == "15:00"


def test_session_end_time_none():
    s = _make_session(end=None)

    assert s.end_time == ""


def test_session_date_display():
    s = _make_session(start=datetime(2025, 7, 16, 14, 30))

    assert s.date_display == "Wednesday, 16 July 2025"


def test_session_date_display_none():
    s = _make_session(start=None)

    assert s.date_display == ""


def test_session_time_display():
    s = _make_session(
        start=datetime(2025, 7, 16, 15, 25),
        end=datetime(2025, 7, 16, 15, 55),
    )

    assert s.time_display == "15:25 – 15:55 CEST"


def test_session_time_display_no_end():
    s = _make_session(start=datetime(2025, 7, 16, 15, 25), end=None)

    assert s.time_display == "15:25 CEST"


def test_session_time_display_no_start():
    s = _make_session(start=None)

    assert s.time_display == ""


def test_session_track_id():
    s = _make_session(track="Machine Learning, NLP and CV")

    assert s.track_id == "machine-learning-nlp-and-cv"


def test_session_track_id_none():
    s = _make_session(track=None)

    assert s.track_id == "other"


def test_session_display_type_hidden():
    for st in ("Talk", "Talk (long session)", "Sponsored"):
        s = _make_session(session_type=st)

        assert s.display_type == ""


def test_session_display_type_shown():
    s = _make_session(session_type="Tutorial")

    assert s.display_type == "Tutorial"


def test_session_display_type_none():
    s = _make_session(session_type=None)

    assert s.display_type == ""


def test_session_speaker_names():
    spk1 = Speaker(code="A", name="Alice", slug="alice")
    spk2 = Speaker(code="B", name="Bob", slug="bob")
    s = _make_session()
    s.speakers = [spk1, spk2]

    assert s.speaker_names == "Alice, Bob"


def test_session_speaker_names_empty():
    s = _make_session()
    s.speakers = []

    assert s.speaker_names == ""
