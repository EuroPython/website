"""Tests for build module."""

import pytest
from markupsafe import Markup

from ep_markdown import md_filter as _md_filter
from build import _sessions_of_type, _group_talks_by_topic
from models import Session, Speaker


# --- _md_filter ---


def test_md_filter_basic():
    result = _md_filter("**bold** text")

    assert isinstance(result, Markup)
    assert "<strong>bold</strong>" in result
    assert "text" in result


def test_md_filter_empty():
    result = _md_filter("")

    assert result == Markup("")


def test_md_filter_none():
    result = _md_filter(None)

    assert result == Markup("")


def test_md_filter_strips_unsafe_tags():
    result = _md_filter("<script>alert('xss')</script>hello")

    assert "<script>" not in result
    assert "hello" in result


def test_md_filter_allows_safe_tags():
    result = _md_filter("[link](http://example.com)")

    assert "<a " in result
    assert "http://example.com" in result


# --- _sessions_of_type ---


def _make_session(code, title, session_type):
    return Session(code=code, title=title, session_type=session_type)


def test_sessions_of_type_filters():
    sessions = {
        "A": _make_session("A", "Zebra Talk", "Talk"),
        "B": _make_session("B", "Alpha Tutorial", "Tutorial"),
        "C": _make_session("C", "Beta Talk", "Talk"),
    }

    result = _sessions_of_type(sessions, {"Talk"})

    assert len(result) == 2
    assert result[0].title == "Beta Talk"
    assert result[1].title == "Zebra Talk"


def test_sessions_of_type_empty():
    sessions = {
        "A": _make_session("A", "A Talk", "Talk"),
    }

    result = _sessions_of_type(sessions, {"Poster"})

    assert result == []


def test_sessions_of_type_multiple_types():
    sessions = {
        "A": _make_session("A", "Talk A", "Talk"),
        "B": _make_session("B", "Long Talk B", "Talk (long session)"),
        "C": _make_session("C", "Tutorial C", "Tutorial"),
    }

    result = _sessions_of_type(sessions, {"Talk", "Talk (long session)"})

    assert len(result) == 2


# --- _group_talks_by_topic ---


def _make_talk(code, title, track):
    return Session(code=code, title=title, session_type="Talk", track=track)


def test_group_talks_by_topic_groups():
    talks = [
        _make_talk("A", "Talk A", "ML"),
        _make_talk("B", "Talk B", "ML"),
        _make_talk("C", "Talk C", "Web"),
    ]

    groups = _group_talks_by_topic(talks)

    assert len(groups) == 2
    # Larger group first
    assert groups[0].topic == "ML"
    assert len(groups[0].talks) == 2
    assert groups[1].topic == "Web"
    assert len(groups[1].talks) == 1


def test_group_talks_by_topic_trackless_last():
    talks = [
        _make_talk("A", "Talk A", None),
        _make_talk("B", "Talk B", "Web"),
    ]

    groups = _group_talks_by_topic(talks)

    assert groups[0].topic == "Web"
    assert groups[1].topic == ""


def test_group_talks_by_topic_empty():
    groups = _group_talks_by_topic([])

    assert groups == []
