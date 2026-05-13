#!/usr/bin/env python3
"""Assemble page templates into build/ using Jinja2."""

import argparse
import json
import os
import shutil
import time
from collections import defaultdict
from collections.abc import Generator
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from types import SimpleNamespace

from jinja2 import Environment, FileSystemLoader

from community_partners import CommunityPartner
from ep_markdown import md_filter, parse_frontmatter, register_globals
from keynotes import KEYNOTES
from menu import FOOTER_COLUMNS, NAV_MENUS, L
from models import Session, Speaker, TopicGroup
from schedule import build_schedule
from search_index import build_index, collect_links
from sponsors import TIER_DEFS, Sponsor, SponsorTier
from teams import TEAMS

_ROOT = Path(__file__).resolve().parent.parent
_TAG = "\033[33m[build]\033[0m"


def _print(msg: str) -> None:
    print(f"{_TAG} {msg}")


@dataclass
class _StepMetric:
    name: str
    label: str = ""
    elapsed: float = 0.0


_metrics: list[_StepMetric] = []


@contextmanager
def _timed(name: str) -> Generator[_StepMetric]:
    """Context manager that measures elapsed time for a build step."""
    metric = _StepMetric(name=name)
    start = time.monotonic()
    yield metric
    metric.elapsed = time.monotonic() - start
    _metrics.append(metric)
    label = f"  {metric.label}" if metric.label else ""
    _print(f"  {name:<18}{label:<22}  {metric.elapsed:.2f}s")


def _build_size() -> tuple[int, int]:
    """Return (total_bytes, file_count) for the build directory."""
    total = 0
    count = 0
    for f in Config.build_path.rglob("*"):
        if f.is_file():
            total += f.stat().st_size
            count += 1
    return total, count


def _format_bytes(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}" if unit != "B" else f"{n} B"
        n //= 1024
    return f"{n:.1f} GB"


def _write_metrics(total_time: float, total_bytes: int, file_count: int) -> None:
    """Write build/metrics.json and GitHub Actions job summary."""
    css_size = (Config.build_path / "style.css").stat().st_size if (Config.build_path / "style.css").exists() else 0
    js_size = (Config.build_path / "script.js").stat().st_size if (Config.build_path / "script.js").exists() else 0

    metrics = {
        "timestamp": Config.build_stamp,
        "total_time_s": round(total_time, 3),
        "total_size_bytes": total_bytes,
        "total_size_human": _format_bytes(total_bytes),
        "file_count": file_count,
        "css_size_bytes": css_size,
        "js_size_bytes": js_size,
        "steps": [{"name": m.name, "label": m.label, "elapsed_s": round(m.elapsed, 3)} for m in _metrics],
    }

    (Config.build_path / "metrics.json").write_text(json.dumps(metrics, indent=2))

    # GitHub Actions job summary
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        lines = [
            "## Build Metrics\n",
            f"**{Config.build_stamp}**\n\n",
            "| Step | Detail | Time |\n",
            "|------|--------|------|\n",
        ]
        for m in _metrics:
            lines.append(f"| {m.name} | {m.label} | {m.elapsed:.2f}s |\n")
        lines += [
            f"\n**Total time:** {total_time:.2f}s\n\n",
            f"**Build size:** {_format_bytes(total_bytes)} ({file_count} files)\n\n",
            f"**CSS:** {_format_bytes(css_size)}  |  **JS:** {_format_bytes(js_size)}\n",
        ]
        with open(summary_file, "a") as f:
            f.writelines(lines)


class Config:
    """Module-level constants."""

    templates = _ROOT / "src" / "templates"
    pages = templates / "pages"
    build_path = _ROOT / "build"
    data = _ROOT / "data"
    content = _ROOT / "src" / "content"

    public = _ROOT / "public"
    styles = _ROOT / "src" / "styles"
    scripts = _ROOT / "src" / "scripts"
    # Dirs under src/ that are copied to build/ root
    src_static_dirs = ["images"]

    # Loaded from src/content/config.json, overridable via SITE_URL env var
    _cfg = json.loads((_ROOT / "src" / "content" / "config.json").read_text())
    base_url: str = (os.environ.get("SITE_URL") or _cfg.get("site", "https://ep2026.europython.eu")).rstrip("/")
    redirects: dict[str, str] = _cfg.get("redirects", {})

    # Programme data API URLs, overridable via env vars
    _api_base = "https://static.europython.eu/programme/ep2026/releases/current"
    sessions_api: str = os.environ.get("EP_SESSIONS_API", f"{_api_base}/sessions.json")
    speakers_api: str = os.environ.get("EP_SPEAKERS_API", f"{_api_base}/speakers.json")
    schedule_api: str = os.environ.get("EP_SCHEDULE_API", f"{_api_base}/schedule.json")

    # Skip detail pages when EP_FAST_BUILD=true
    fast_build: bool = os.environ.get("EP_FAST_BUILD", "").lower() == "true"

    # Minify CSS and JS when EP_MINIFY=true
    minify: bool = os.environ.get("EP_MINIFY", "").lower() == "true"

    # Force avatar proxy (wsrv.nl) even if local avatars exist — set EP_AVATAR_PROXY=true
    avatar_proxy: bool = os.environ.get("EP_AVATAR_PROXY", "").lower() == "true"

    talk_types = {"Talk", "Talk (long session)", "Keynote"}
    tutorial_types = {"Tutorial"}
    poster_types = {"Poster"}

    build_version = time.strftime("%Y%m%d%H%M%S")
    build_commit = ""
    build_stamp = build_version


# Public API
# ==========


def build_all(*, details: bool = True):
    """Build the site. Set details=False to skip session/speaker detail pages."""
    _metrics.clear()
    build_start = time.monotonic()

    env = _build_env()
    ctx = _build_ctx()

    if Config.build_path.exists():
        shutil.rmtree(Config.build_path)
    Config.build_path.mkdir()

    with _timed("pages") as m:
        build_pages(env, ctx)
        m.label = f"{sum(1 for _ in Config.build_path.glob('*/index.html'))} pages"

    if details:
        with _timed("sessions") as m:
            build_sessions(env, ctx)
            m.label = f"{len(ctx['sessions'])} sessions"
        with _timed("speakers") as m:
            build_speakers(env, ctx)
            m.label = f"{len(ctx['speakers'])} speakers"

    with _timed("sponsors") as m:
        build_sponsors(env, ctx)
        m.label = f"{sum(len(t.sponsors) for t in ctx['sponsor_tiers'])} sponsors"

    with _timed("redirects") as m:
        build_redirects()
        m.label = f"{len(Config.redirects)} redirects"

    with _timed("404"):
        build_404(env, ctx)

    with _timed("search_index"):
        build_search_index(ctx)

    with _timed("sitemap") as m:
        build_sitemap()
        m.label = f"{sum(1 for _ in Config.build_path.rglob('index.html'))} URLs"

    with _timed("static_assets"):
        copy_static_assets()

    total_time = time.monotonic() - build_start
    total_bytes, file_count = _build_size()
    css_size = (Config.build_path / "style.css").stat().st_size if (Config.build_path / "style.css").exists() else 0
    js_size = (Config.build_path / "script.js").stat().st_size if (Config.build_path / "script.js").exists() else 0

    _print("─" * 50)
    _print(f"✓ build complete → {Config.build_path}")
    _print(f"  {Config.build_stamp}")
    _print(f"  total time:  {total_time:.2f}s")
    _print(f"  total size:  {_format_bytes(total_bytes)} ({file_count} files)")
    _print(f"  css: {_format_bytes(css_size)}   js: {_format_bytes(js_size)}")

    _write_metrics(total_time, total_bytes, file_count)


def build_sessions(env: Environment, ctx: dict) -> None:
    """Render individual session detail pages."""
    template = env.get_template("session.html")
    out_dir = Config.build_path / "session"
    out_dir.mkdir(parents=True, exist_ok=True)

    all_sessions = list(ctx["sessions"].values())
    for session in all_sessions:
        if not session.slug:
            _print(f"WARN: session {session.code} has no slug, skipping")
            continue
        _write_detail_page(out_dir, session.slug, template, ctx, session=session)
    _print(f"  built {len(all_sessions)} session detail pages")


def build_speakers(env: Environment, ctx: dict) -> None:
    """Render individual speaker detail pages."""
    template = env.get_template("speaker.html")
    out_dir = Config.build_path / "speaker"
    out_dir.mkdir(parents=True, exist_ok=True)

    for speaker in ctx["speakers"]:
        if not speaker.slug:
            _print(f"WARN: speaker {speaker.code} has no slug, skipping")
            continue
        _write_detail_page(out_dir, speaker.slug, template, ctx, speaker=speaker)
    _print(f"  built {len(ctx['speakers'])} speaker detail pages")


def build_sponsors(env: Environment, ctx: dict) -> None:
    """Render platinum sponsor detail pages."""
    template = env.get_template("sponsor.html")
    out_dir = Config.build_path / "sponsorship"
    out_dir.mkdir(parents=True, exist_ok=True)

    platinum = ctx["sponsor_tiers"][0]
    count = 0
    for sponsor in platinum.sponsors:
        if not sponsor.slug:
            continue
        _write_detail_page(out_dir, sponsor.slug, template, ctx, sponsor=sponsor)
        count += 1

    # Sponsor information page
    info_template = env.get_template("sponsor_information.html")
    _write_detail_page(out_dir, "information", info_template, ctx)
    count += 1

    _print(f"  built {count} sponsor detail pages")


def build_pages(env: Environment, ctx: dict) -> None:
    # 1. Markdown-driven pages: src/content/pages/*.md → one route per file
    md_template = env.get_template("pages/_md_page.html")
    for md_path in sorted((Config.content / "pages").glob("*.md")):
        meta, _ = parse_frontmatter(md_path.read_text())
        slug = md_path.stem
        page = SimpleNamespace(
            slug=slug,
            title=meta.get("title", slug),
            section_label=meta.get("section_label", meta.get("title", slug)),
            subtitle=meta.get("subtitle", ""),
            breadcrumb=meta.get("breadcrumb") or [],
        )
        _write_page(Config.build_path, slug, md_template.render(**ctx, page=page))

    # 2. Block-composite pages: src/content/pages.json → one route per entry
    block_template = env.get_template("pages/_block_page.html")
    routes_path = Config.content / "pages.json"
    if routes_path.exists():
        for route in json.loads(routes_path.read_text()):
            flags = route.get("flags", {})
            page = SimpleNamespace(
                slug=route["slug"],
                title=route.get("title", route["slug"].replace("_", " ").title()),
                blocks=route["blocks"],
                breadcrumb=route.get("breadcrumb", []),
            )
            _write_page(Config.build_path, page.slug, block_template.render(**ctx, **flags, page=page))

    # 3. Explicit .html templates (index, programme, participate, etc.)
    # Skip underscore-prefixed templates (they are partials, not routes)
    for html_page in sorted(Config.pages.glob("*.html")):
        if html_page.stem.startswith("_"):
            continue
        template = env.get_template(f"pages/{html_page.name}")
        stem = html_page.stem
        if stem == "index":
            out_path = Config.build_path / "index.html"
            html = template.render(**ctx)
            out_path.write_text(html)
            _print(f"  built {out_path.relative_to(Config.build_path)}")
        else:
            _write_page(Config.build_path, stem, template.render(**ctx))


def copy_static_assets() -> None:
    # Copy everything in public/ → build/ (preserves subdirectory structure)
    if Config.public.exists():
        for item in Config.public.iterdir():
            dest = Config.build_path / item.name
            if item.is_dir():
                shutil.copytree(item, dest)
            else:
                shutil.copy2(item, dest)

    # CSS and JS from src/styles/ and src/scripts/ — minify if EP_MINIFY=true
    css = (Config.styles / "style.css").read_text()
    js = (Config.scripts / "script.js").read_text()
    if Config.minify:
        import rcssmin  # noqa: PLC0415
        import rjsmin  # noqa: PLC0415

        css = rcssmin.cssmin(css)
        js = rjsmin.jsmin(js)
    (Config.build_path / "style.css").write_text(css)
    (Config.build_path / "script.js").write_text(js)

    # avatars/ → build/avatars/ (only if local avatars were downloaded)
    avatars_src = _ROOT / "avatars"
    if avatars_src.exists():
        shutil.copytree(avatars_src, Config.build_path / "avatars")

    # src/images/ → build/images/
    for name in Config.src_static_dirs:
        src = _ROOT / "src" / name
        if src.exists():
            shutil.copytree(src, Config.build_path / name)

    # Copy logo files from content dirs into build/logos/
    logos_out = Config.build_path / "logos"
    logos_out.mkdir(exist_ok=True)
    for content_subdir in ["sponsors", "community-partners"]:
        for entry in (Config.content / content_subdir).iterdir():
            if not entry.is_dir():
                continue
            slug = entry.name
            for img in entry.iterdir():
                if img.suffix.lower() not in {".svg", ".png", ".jpg", ".webp"}:
                    continue
                # Rename display.png → <slug>-display.png to avoid collisions
                dest_name = f"{slug}-display.png" if img.name == "display.png" else img.name
                shutil.copy2(img, logos_out / dest_name)

    _print("  copied static assets")


_REDIRECT_HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url={url}">
<link rel="canonical" href="{url}">
<title>Redirecting…</title>
<script>window.location.replace("{url}");</script>
</head>
<body><a href="{url}">Redirecting…</a></body>
</html>
"""


def build_redirects() -> None:
    """Generate redirect pages from config.json redirects."""
    count = 0
    for src_path, target in Config.redirects.items():
        # Resolve relative targets to absolute URLs
        url = f"{Config.base_url}{target}" if target.startswith("/") else target
        # Write build/<slug>/index.html — strip leading/trailing slashes for path
        slug = src_path.strip("/")
        out_dir = Config.build_path / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(_REDIRECT_HTML.format(url=url))
        count += 1
    if count:
        _print(f"  redirects → {count}")


def build_404(env: Environment, ctx: dict) -> None:
    """Render 404.html into build/404.html."""
    try:
        template = env.get_template("404.html")
    except Exception:
        return
    html = template.render(**ctx)
    (Config.build_path / "404.html").write_text(html)
    _print("  built 404.html")


def build_sitemap() -> None:
    """Generate sitemap.xml from all index.html files in build/."""
    urls = []
    for index_file in sorted(Config.build_path.rglob("index.html")):
        rel = index_file.parent.relative_to(Config.build_path)
        path = "/" if str(rel) == "." else f"/{rel}/"
        if path in Config.redirects:
            continue
        urls.append(f"{Config.base_url}{path}")

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        lines.append(f"  <url><loc>{url}</loc></url>")
    lines.append("</urlset>")

    out = Config.build_path / "sitemap.xml"
    out.write_text("\n".join(lines) + "\n")
    _print(f"  sitemap → {len(urls)} URLs")


def build_search_index(ctx: dict) -> None:
    """Build search index from context data."""
    links = collect_links()
    build_index(
        Config.build_path,
        links,
        list(ctx["sessions"].values()),
        ctx["speakers"],
        sponsor_tiers=ctx.get("sponsor_tiers"),
        community_partners=ctx.get("community_partners"),
    )


# Private helpers
# ===============


def _avatar_url(url: str | None, size: int = 200) -> str:
    """Return an optimized avatar URL.

    - EP_AVATAR_PROXY=true or no local avatars: rewrite through wsrv.nl proxy.
    - Local avatars present and proxy not forced: serve from /avatars/<stem>-<size>.webp.
    """
    if not url:
        return ""
    if not Config.avatar_proxy:
        avatars_dir = _ROOT / "avatars"
        if avatars_dir.exists():
            stem = Path(url.split("?")[0]).stem
            local = avatars_dir / f"{stem}-{size}.webp"
            if local.exists():
                return f"/avatars/{stem}-{size}.webp"
    # Fallback: wsrv.nl proxy
    clean = url.replace("https://", "").replace("http://", "")
    return f"https://wsrv.nl/?url={clean}&w={size}&h={size}&fit=cover&output=webp&q=85"


def _build_env() -> Environment:
    dirs = [Config.templates, Config.templates / "blocks", Config.templates / "detail"]
    env = Environment(
        loader=FileSystemLoader(dirs),
        keep_trailing_newline=True,
        trim_blocks=True,
        lstrip_blocks=True,
        autoescape=True,
    )
    env.filters["md"] = md_filter
    env.filters["avatar"] = _avatar_url
    register_globals(env, Config.content)
    return env


def _build_ctx() -> dict:
    ctx = {
        "nav_menus": NAV_MENUS,
        "footer_columns": FOOTER_COLUMNS,
        "L": L,
        "teams": TEAMS,
        "sponsor_tiers": _load_sponsors(),
        "community_partners": _load_community_partners(),
        "keynotes": KEYNOTES,
        "base_path": "/",
        "base_url": Config.base_url,
        "search_index_version": Config.build_version,
        "build_stamp": Config.build_stamp,
    }
    ctx.update(_load_programme_data())
    _resolve_keynote_urls(ctx)
    return ctx


_TIER_MAP: dict[str, str] = {
    "platinum": "platinum",
    "gold": "gold",
    "silver": "silver",
    "bronze": "bronze",
    "patron": "patron",
    "financial aid": "finaid",
    "finaid": "finaid",
    "supporter": "supporter",
    "supporters": "supporter",
}


def _normalise_tier(raw: str) -> str:
    return _TIER_MAP.get(raw.lower(), "")


def _find_logo(directory: Path, slug: str) -> str:
    """Return /logos/<filename> for the first image in directory, preferring slug-named files."""
    preferred = [directory / f"{slug}.svg", directory / f"{slug}.png"]
    fallbacks = sorted(
        f for f in directory.iterdir() if f.suffix.lower() in {".svg", ".png"} and "display" not in f.name
    )
    for candidate in preferred + fallbacks:
        if candidate.exists():
            return f"/logos/{candidate.name}"
    return ""


def _find_cover(directory: Path, slug: str) -> str:
    """Return /logos/<filename> for a display/cover image, falling back to logo."""
    display = directory / "display.png"
    if display.exists():
        return f"/logos/{slug}-display.png"
    return _find_logo(directory, slug)


def _load_sponsors() -> list[SponsorTier]:
    """Build sponsor tiers from content/sponsors/*/index.md files."""
    content_dir = Config.content / "sponsors"
    if not content_dir.exists():
        return []

    by_tier: dict[str, list[Sponsor]] = {}
    for index_md in sorted(content_dir.glob("*/index.md")):
        slug = index_md.parent.name
        meta, body = parse_frontmatter(index_md.read_text())

        # Normalise tier: accept any casing, map old names
        raw_tier = str(meta.get("tier", "")).strip()
        tier_key = _normalise_tier(raw_tier)
        if not tier_key:
            continue

        logo = _find_logo(index_md.parent, slug)
        website = meta.get("website") or meta.get("url", "")
        summary = meta.get("summary") or meta.get("description", "")
        if isinstance(summary, list):
            summary = " ".join(summary)
        is_platinum = tier_key == "platinum"

        sponsor = Sponsor(
            name=meta.get("name", slug),
            logo=logo,
            slug=slug,
            url=f"/sponsorship/{slug}/" if is_platinum else f"/sponsorship/#sponsor-{slug}",
            summary=str(summary).strip(),
            description=body.strip(),
            website=str(website).strip(),
            location=str(meta.get("location", "")).strip(),
            cover=_find_cover(index_md.parent, slug),
            socials={k: v for k, v in (meta.get("socials") or {}).items() if v},
        )
        by_tier.setdefault(tier_key, []).append(sponsor)

    tiers = []
    for td in TIER_DEFS:
        sponsors = by_tier.get(td.key, [])
        if sponsors:
            tiers.append(SponsorTier(td.label, td.css_class, td.key, sponsors))
    return tiers


def _load_community_partners() -> list[CommunityPartner]:
    """Build community partners from content/community-partners/*/index.md files."""
    content_dir = Config.content / "community-partners"
    if not content_dir.exists():
        return []

    partners = []
    for index_md in sorted(content_dir.glob("*/index.md")):
        slug = index_md.parent.name
        meta, _ = parse_frontmatter(index_md.read_text())
        partners.append(
            CommunityPartner(
                name=meta.get("name", slug),
                logo=_find_logo(index_md.parent, slug),
                slug=slug,
                url=f"/community/#community-partner-{slug}",
                summary=meta.get("summary", ""),
                website=meta.get("website", ""),
            )
        )
    return partners


def _resolve_keynote_urls(ctx: dict) -> None:
    """Set session_url and avatar from speaker data on keynotes that have a session_code."""
    sessions = ctx.get("sessions", {})
    for k in ctx.get("keynotes", []):
        if k.session_code and k.session_code in sessions:
            session = sessions[k.session_code]
            k.session_url = session.url
            if session.speakers and session.speakers[0].avatar:
                k.photo = session.speakers[0].avatar


def _write_page(build_path: Path, slug: str, html: str) -> None:
    """Write a rendered page to build/<slug>/index.html."""
    out_dir = build_path / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(html)
    _print(f"  built {slug}/index.html")


def _write_detail_page(out_dir: Path, slug: str, template, ctx: dict, **extra) -> None:
    """Render a single detail page into out_dir/<slug>/index.html."""
    slug_dir = out_dir / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    html = template.render(**ctx, **extra)
    (slug_dir / "index.html").write_text(html)


def _load_programme_data() -> dict:
    """Load speakers, sessions, schedule from data/ and resolve all relations."""
    speakers_path = Config.data / "speakers.json"
    sessions_path = Config.data / "sessions.json"
    schedule_path = Config.data / "schedule.json"

    if not speakers_path.exists() or not sessions_path.exists():
        return {
            "speakers": [],
            "sessions": {},
            "talks": [],
            "talks_by_topic": [],
            "talk_topics": [],
            "tutorials": [],
            "posters": [],
            "schedule_days": [],
            "beginner_sessions": [],
            "data_sessions": [],
            "data_sessions_by_topic": [],
        }

    raw_speakers = json.loads(speakers_path.read_text())
    raw_sessions = json.loads(sessions_path.read_text())
    raw_schedule = json.loads(schedule_path.read_text()) if schedule_path.exists() else {}

    # Build objects
    speakers = {code: Speaker.model_validate(s) for code, s in raw_speakers.items()}
    sessions = {code: Session.model_validate(s) for code, s in raw_sessions.items()}

    # Resolve session → speaker objects
    for sess in sessions.values():
        sess.speakers = [speakers[c] for c in sess.speakers if c in speakers]

    # Resolve speaker → session objects (from submissions in speakers.json)
    for spk in speakers.values():
        spk.sessions = [sessions[c] for c in spk.submissions if c in sessions]

    # Resolve session → related session objects
    for sess in sessions.values():
        sess.sessions_in_parallel = [sessions[c] for c in sess.sessions_in_parallel if c in sessions]
        sess.sessions_after = [sessions[c] for c in sess.sessions_after if c in sessions]

    schedule_days = build_schedule(raw_schedule, sessions)

    # Pass room order and schedule day slots to sessions
    room_order: dict[str, int] = {}
    day_info_by_date: dict[str, tuple] = {}
    for day in schedule_days:
        for i, r in enumerate(day.rooms):
            room_order.setdefault(r, i)
        day_info_by_date[day.date] = (day.slots, day.day_id)
    for sess in sessions.values():
        sess.room_order = room_order
        if sess.start:
            date_key = sess.start.strftime("%Y-%m-%d")
            slots, day_id = day_info_by_date.get(date_key, ([], ""))
            sess.schedule_day_slots = slots
            sess.schedule_day_id = day_id

    talks = _sessions_of_type(sessions, Config.talk_types)
    talk_topics = sorted({t.track for t in talks if t.track})
    tutorials = _sessions_of_type(sessions, Config.tutorial_types)
    posters = _sessions_of_type(sessions, Config.poster_types)

    data_tracks = {
        "Data Engineering and MLOps",
        "Data preparation and visualisation",
        "Machine Learning, NLP and CV",
        "Machine Learning: Research & Applications",
        "Jupyter and Scientific Python",
    }
    all_talk_tutorial_types = Config.talk_types | Config.tutorial_types
    beginner_sessions = sorted(
        [s for s in sessions.values() if s.level == "beginner" and s.session_type in all_talk_tutorial_types],
        key=lambda s: s.title,
    )
    data_sessions = sorted(
        [s for s in sessions.values() if s.track in data_tracks],
        key=lambda s: s.title,
    )
    data_sessions_by_topic = _group_talks_by_topic(data_sessions)

    return {
        "speakers": sorted(speakers.values(), key=lambda s: s.name),
        "sessions": sessions,
        "talks": talks,
        "talks_by_topic": _group_talks_by_topic(talks),
        "talk_topics": talk_topics,
        "tutorials": tutorials,
        "posters": posters,
        "schedule_days": schedule_days,
        "beginner_sessions": beginner_sessions,
        "data_sessions": data_sessions,
        "data_sessions_by_topic": data_sessions_by_topic,
    }


def _sessions_of_type(sessions: dict[str, Session], types: set[str]) -> list[Session]:
    """Filter sessions by type, sorted by title."""
    return sorted(
        [s for s in sessions.values() if s.session_type in types],
        key=lambda s: s.title,
    )


def _group_talks_by_topic(talks: list[Session]) -> list[TopicGroup]:
    """Group talks by track, sorted by group size descending, trackless last."""
    by_track = defaultdict(list)

    for t in talks:
        by_track[t.track or ""].append(t)

    groups = [TopicGroup(topic=track, topic_slug=group[0].track_id, talks=group) for track, group in by_track.items()]

    groups.sort(key=lambda g: (not g.topic, -len(g.talks)))
    return groups


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="Include session/speaker detail pages")
    parser.add_argument("--commit", default="", help="Git commit hash to include in build stamp")
    args = parser.parse_args()

    if args.commit:
        Config.build_commit = args.commit[:8]
        Config.build_stamp = f"{Config.build_commit} @ {Config.build_version}"

    # EP_FAST_BUILD skips detail pages unless --all is explicitly passed
    details = args.all or not Config.fast_build
    build_all(details=details)
