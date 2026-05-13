#!/usr/bin/env python3
"""Build a site-wide search index from menu links and programme data."""

import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

from community_partners import CommunityPartner
from menu import FOOTER_COLUMNS, NAV_MENUS, Link
from models import Session, Speaker
from sponsors import Sponsor, SponsorTier

_TAG = "\033[33m[build]\033[0m"


def build_index(
    build_dir: Path,
    links: list[Link],
    sessions: list[Session],
    speakers: list[Speaker],
    sponsor_tiers: list[SponsorTier] | None = None,
    community_partners: list[CommunityPartner] | None = None,
) -> str:
    """Write build/search-index.json from menu links + programme data."""
    entries: list[dict] = [
        {
            "t": "Home",
            "p": "Back to homepage",
            "u": "/",
            "k": "home back to homepage main page",
        },
    ]

    for link in links:
        entry = _index_link(build_dir, link)
        if entry:
            entries.append(entry)

    for sess in sessions:
        entries.append(_index_session(sess))

    for spk in speakers:
        entries.append(_index_speaker(spk))

    for tier in (sponsor_tiers or []):
        for sponsor in tier.sponsors:
            entries.append(_index_sponsor(sponsor, tier.label))

    for cp in (community_partners or []):
        entries.append(_index_community_partner(cp))

    out = build_dir / "search-index.json"
    content = json.dumps(entries, ensure_ascii=False)
    out.write_text(content)
    digest = hashlib.md5(content.encode()).hexdigest()[:8]
    print(f"{_TAG}   search index → {len(entries)} entries (v={digest})")
    return digest


def _index_link(build_dir: Path, link: Link) -> dict | None:
    """Extract text from the built HTML section for a menu link."""
    url = link.url
    if url == "#" or link.external:
        return None
    if url.startswith("#"):
        return None

    page_path, anchor = _resolve_url(build_dir, url)
    if not page_path or not page_path.exists():
        return None

    html = page_path.read_text()
    text = _extract_section_text(html, anchor) if anchor else _extract_main_text(html)
    text = _collapse(text)

    return {
        "t": link.label,
        "p": text[:200],
        "u": url,
        "k": (link.label + " " + text[:2000]).lower(),
    }


def _session_label(session_type: str) -> str:
    """Map session_type to a short search index label."""
    labels = {
        "Talk": "Talk",
        "Talk (long session)": "Talk",
        "Keynote": "Keynote",
        "Tutorial": "Tutorial",
        "Poster": "Poster",
    }
    return labels.get(session_type, session_type)


def _index_session(sess: Session) -> dict:
    speaker_names = ", ".join(s.name for s in sess.speakers)
    abstract = _strip_tags(sess.abstract or "")
    label = _session_label(sess.session_type or "")
    keywords = " ".join([sess.title, speaker_names, sess.track or "", abstract[:300]])
    preview = f"{label}: " if label else ""
    preview += speaker_names
    if abstract:
        preview += " — " + abstract[:150] if speaker_names else abstract[:200]

    return {
        "t": sess.title,
        "p": preview[:200],
        "u": sess.url,
        "k": keywords[:500].lower(),
    }


def _index_speaker(spk: Speaker) -> dict:
    bio = _strip_tags(spk.biography or "")
    keywords = " ".join([spk.name, spk.affiliation or "", bio[:300]])
    preview = "Speaker: " + (spk.affiliation or "")
    if bio:
        preview += " — " + bio[:150] if spk.affiliation else bio[:200]

    return {
        "t": spk.name,
        "p": preview[:200],
        "u": spk.url,
        "k": keywords[:500].lower(),
    }


def _index_sponsor(sponsor: Sponsor, tier_label: str) -> dict:
    description = _strip_tags(sponsor.description) if sponsor.description else ""
    keywords = " ".join([sponsor.name, tier_label, "sponsor", sponsor.summary, description[:300]])
    preview = f"{tier_label} Sponsor"
    if sponsor.summary:
        preview += " — " + sponsor.summary

    return {
        "t": sponsor.name,
        "p": preview[:200],
        "u": sponsor.url,
        "k": keywords[:500].lower(),
    }


def _index_community_partner(cp: CommunityPartner) -> dict:
    keywords = " ".join([cp.name, "community partner", cp.summary])
    preview = "Community Partner"
    if cp.summary:
        preview += " — " + cp.summary

    return {
        "t": cp.name,
        "p": preview[:200],
        "u": cp.url,
        "k": keywords[:500].lower(),
    }


# HTML helpers
# ============


def _resolve_url(build_dir: Path, url: str) -> tuple[Path | None, str]:
    """Turn /venue/#krakow into (build/venue/index.html, 'krakow')."""
    anchor = ""
    if "#" in url:
        path_part, anchor = url.split("#", 1)
    else:
        path_part = url

    path_part = path_part.strip("/")
    if not path_part:
        page = build_dir / "index.html"
    else:
        page = build_dir / path_part / "index.html"
        if not page.exists():
            page = build_dir / (path_part + ".html")

    return page, anchor


class _TextExtractor(HTMLParser):
    """Pull text from HTML, optionally only within a target id."""

    def __init__(self, target_id: str = ""):
        super().__init__()
        self.target_id = target_id
        self.inside = not target_id
        self.depth = 0
        self.parts: list[str] = []
        self._skip = False

    def handle_starttag(self, tag: str, attrs: list) -> None:
        attr_dict = dict(attrs)
        if tag in ("script", "style", "nav"):
            self._skip = True
            return
        if self.target_id and attr_dict.get("id") == self.target_id:
            self.inside = True
            self.depth = 1
            return
        if self.inside and self.target_id:
            self.depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style", "nav"):
            self._skip = False
            return
        if self.inside and self.target_id:
            self.depth -= 1
            if self.depth <= 0:
                self.inside = False

    def handle_data(self, data: str) -> None:
        if self.inside and not self._skip:
            self.parts.append(data)


def _extract_section_text(html: str, section_id: str) -> str:
    parser = _TextExtractor(target_id=section_id)
    parser.feed(html)
    return " ".join(parser.parts)


def _extract_main_text(html: str) -> str:
    parser = _TextExtractor(target_id="main")
    parser.feed(html)
    if parser.parts:
        return " ".join(parser.parts)
    # Fallback: extract all body text
    parser2 = _TextExtractor()
    parser2.feed(html)
    return " ".join(parser2.parts)


def _strip_tags(html: str) -> str:
    parser = _TextExtractor()
    parser.feed(html)
    return _collapse(" ".join(parser.parts))


def _collapse(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def collect_links() -> list[Link]:
    """Gather unique Link objects from nav menus and footer columns."""
    seen: set[str] = set()
    links: list[Link] = []
    for menu in NAV_MENUS:
        for section in menu.sections:
            for item in section.items:
                if item.url not in seen:
                    seen.add(item.url)
                    links.append(item)
    for col in FOOTER_COLUMNS:
        for item in col.items:
            if item.url not in seen:
                seen.add(item.url)
                links.append(item)
    return links


