"""Markdown rendering, sanitisation, and Jinja integration."""

import re
from pathlib import Path

import bleach
import markdown as md_lib
from jinja2 import Environment
from markupsafe import Markup

# Bleach config
# =============

BLEACH_TAGS = [
    "a",
    "abbr",
    "acronym",
    "b",
    "blockquote",
    "br",
    "code",
    "em",
    "hr",
    "i",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "ul",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "img",
]
BLEACH_ATTRS = {
    "a": ["href", "title"],
    "img": ["src", "alt", "title"],
    "h1": ["id"],
    "h2": ["id"],
    "h3": ["id"],
    "h4": ["id"],
    "h5": ["id"],
    "h6": ["id"],
}

_MD_EXTENSIONS = ["fenced_code", "toc"]

# Regex patterns
# ==============

_HEADING_RE = re.compile(r"<(h[1-6])\b([^>]*)>(.*?)</\1>", re.DOTALL)
_TOC_RE = re.compile(r'<h2\b[^>]*id="([^"]*)"[^>]*>(.*?)</h2>', re.DOTALL)
_JINJA_IN_P_RE = re.compile(r"<p>\s*(\{[%{].*?[%}]\})\s*</p>", re.DOTALL)


# Public API
# ==========


def md_filter(text: str) -> Markup:
    """Jinja filter: render markdown to sanitised HTML."""
    if not text:
        return Markup("")
    text = text.replace("\r\n", "\n")
    html = md_lib.markdown(text, extensions=_MD_EXTENSIONS)
    html = bleach.clean(html, tags=BLEACH_TAGS, attributes=BLEACH_ATTRS)
    html = _linkify_headings(html)
    return Markup(html)


def register_globals(env: Environment, content_dir: Path) -> None:
    """Register markdown_include and markdown_toc as Jinja globals."""
    cache: dict[str, str] = {}

    def _render(filename: str) -> str:
        if filename not in cache:
            path = content_dir / filename
            if not path.exists():
                cache[filename] = ""
                return ""
            _, body = parse_frontmatter(path.read_text())
            html = md_lib.markdown(body.strip(), extensions=_MD_EXTENSIONS)
            html = _JINJA_IN_P_RE.sub(r"\1", html)
            html = bleach.clean(html, tags=BLEACH_TAGS, attributes=BLEACH_ATTRS)
            html = _linkify_headings(html)
            cache[filename] = html
        return cache[filename]

    def markdown_include(filename: str) -> Markup:
        return Markup(env.from_string(_render(filename)).render())

    def markdown_toc(filename: str) -> Markup:
        return Markup(_build_toc(_render(filename)))

    env.globals["markdown_include"] = markdown_include
    env.globals["markdown_toc"] = markdown_toc


# Private helpers
# ===============


def _linkify_headings(html: str) -> str:
    """Wrap heading text in <a href="#id"> anchors."""

    def _replace(m: re.Match) -> str:
        tag, attrs, text = m.group(1), m.group(2), m.group(3)
        id_match = re.search(r'id="([^"]*)"', attrs)
        if not id_match:
            return m.group(0)
        hid = id_match.group(1)
        return f'<{tag}{attrs}><a href="#{hid}">{text}</a></{tag}>'

    return _HEADING_RE.sub(_replace, html)


def _build_toc(html: str) -> str:
    """Build a list of links from h2 headings."""
    items = []
    for m in _TOC_RE.finditer(html):
        hid = m.group(1)
        label = re.sub(r"<[^>]+>", "", m.group(2))
        items.append(f'<li><a href="#{hid}">{label}</a></li>')
    if not items:
        return ""
    return (
        '<div class="info-toc"><div class="info-toc-title">Table of Contents</div><ul>' + "".join(items) + "</ul></div>"
    )


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown text. Returns (metadata, body)."""
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    import yaml

    meta = yaml.safe_load(parts[1]) or {}
    return meta, parts[2]
