"""Tests for search_index module."""

from pathlib import Path

import pytest

from search_index import _collapse, _strip_tags, _session_label, _resolve_url, _extract_section_text, _extract_main_text


# --- _collapse ---


@pytest.mark.parametrize(
    "text, expected",
    [
        ("  hello   world  ", "hello world"),
        ("no\nnewlines\there", "no newlines here"),
        ("already clean", "already clean"),
        ("", ""),
        ("   ", ""),
    ],
)
def test_collapse(text, expected):
    assert _collapse(text) == expected


# --- _strip_tags ---


@pytest.mark.parametrize(
    "html, expected",
    [
        ("<p>Hello <b>world</b></p>", "Hello world"),
        ("plain text", "plain text"),
        ("<script>evil()</script>visible", "visible"),
        ("", ""),
    ],
)
def test_strip_tags(html, expected):
    assert _strip_tags(html) == expected


# --- _session_label ---


@pytest.mark.parametrize(
    "session_type, expected",
    [
        ("Talk", "Talk"),
        ("Talk (long session)", "Talk"),
        ("Keynote", "Keynote"),
        ("Tutorial", "Tutorial"),
        ("Poster", "Poster"),
        ("Workshop", "Workshop"),
    ],
)
def test_session_label(session_type, expected):
    assert _session_label(session_type) == expected


# --- _resolve_url ---


def test_resolve_url_root(tmp_path):
    index = tmp_path / "index.html"
    index.write_text("<html></html>")

    page, anchor = _resolve_url(tmp_path, "/")

    assert page == index
    assert anchor == ""


def test_resolve_url_with_anchor(tmp_path):
    venue_dir = tmp_path / "venue"
    venue_dir.mkdir()
    index = venue_dir / "index.html"
    index.write_text("<html></html>")

    page, anchor = _resolve_url(tmp_path, "/venue/#krakow")

    assert page == index
    assert anchor == "krakow"


def test_resolve_url_subpage(tmp_path):
    talks_dir = tmp_path / "talks"
    talks_dir.mkdir()
    index = talks_dir / "index.html"
    index.write_text("<html></html>")

    page, anchor = _resolve_url(tmp_path, "/talks/")

    assert page == index
    assert anchor == ""


# --- _extract_section_text ---


def test_extract_section_text():
    html = '<div id="intro">Hello <b>World</b></div><div id="other">Nope</div>'

    result = _extract_section_text(html, "intro")

    assert "Hello" in result
    assert "World" in result
    assert "Nope" not in result


def test_extract_section_text_missing_id():
    html = '<div id="intro">Content</div>'

    result = _extract_section_text(html, "nonexistent")

    assert result.strip() == ""


# --- _extract_main_text ---


def test_extract_main_text():
    html = '<nav>Menu</nav><main id="main">Main content here</main>'

    result = _extract_main_text(html)

    assert "Main content" in result
    assert "Menu" not in result


def test_extract_main_text_fallback():
    html = "<body>Fallback content</body>"

    result = _extract_main_text(html)

    assert "Fallback" in result
