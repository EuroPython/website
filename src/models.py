import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from pydantic import BaseModel


def _slugify(text: str) -> str:
    """Turn a string into a URL-safe id fragment."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class Speaker(BaseModel):
    code: str
    name: str
    slug: str = ""
    biography: str | None = ""
    avatar: str | None = ""
    affiliation: str | None = ""
    homepage: str | None = None
    linkedin_url: str | None = None
    twitter_url: str | None = None
    mastodon_url: str | None = None
    bluesky_url: str | None = None
    gitx_url: str | None = None
    submissions: list[str] = []
    sessions: list = []

    @property
    def url(self) -> str:
        return f"/speaker/{self.slug}/"


_HIDDEN_SESSION_TYPES = {"Talk", "Talk (long session)", "Sponsored"}


class Session(BaseModel):
    code: str
    title: str
    speakers: list = []
    track: str | None = None
    session_type: str | None = None
    slug: str = ""
    abstract: str | None = ""
    duration: str | None = ""
    level: str | None = ""
    room: str | None = ""
    start: datetime | None = None
    end: datetime | None = None
    tweet: str | None = ""
    website_url: str | None = ""
    youtube_url: str | None = ""
    sessions_in_parallel: list = []
    sessions_after: list = []
    room_order: dict = {}
    schedule_day_slots: list = []  # ScheduleSlot list for this session's day
    schedule_day_id: str = ""

    @property
    def url(self) -> str:
        return f"/session/{self.slug}/"

    @property
    def start_time(self) -> str:
        return self.start.strftime("%H:%M") if self.start else ""

    @property
    def end_time(self) -> str:
        return self.end.strftime("%H:%M") if self.end else ""

    @property
    def date_display(self) -> str:
        """E.g. 'Wednesday, 16 July 2025'."""
        return self.start.strftime("%A, %-d %B %Y") if self.start else ""

    @property
    def time_display(self) -> str:
        """E.g. '15:25 – 15:55 CEST'."""
        if not self.start:
            return ""
        s = self.start.strftime("%H:%M")
        e = self.end.strftime("%H:%M") if self.end else ""
        return f"{s} – {e} CEST" if e else f"{s} CEST"

    @property
    def track_id(self) -> str:
        """URL-safe slug of the track name."""
        return _slugify(self.track) if self.track else "other"

    @property
    def speaker_names(self) -> str:
        return ", ".join(s.name for s in self.speakers)

    @property
    def display_type(self) -> str:
        st = self.session_type or ""
        return "" if st in _HIDDEN_SESSION_TYPES else st

    @property
    def session_page_at_the_same_time(self) -> list:
        """Current session + parallel sessions, sorted by room order."""
        row = [self] + list(self.sessions_in_parallel)
        row.sort(key=lambda s: self.room_order.get(s.room, 999))
        return row

    @property
    def session_page_up_next(self) -> list:
        """Schedule slots starting after this session, within 30min of end."""
        if not self.end or not self.schedule_day_slots:
            return []
        end_str = self.end.strftime("%H:%M")
        cutoff = (self.end + timedelta(minutes=30)).strftime("%H:%M")
        return [slot for slot in self.schedule_day_slots if end_str <= slot.start_time <= cutoff]

    def get_speaker_names(self) -> str:
        """Return lowercase speaker names for search indexing."""
        return " ".join(s.name for s in self.speakers).lower()

    def get_track_name(self) -> str:
        """Return lowercase track name for search indexing."""
        return (self.track or "").lower()


@dataclass
class TopicGroup:
    topic: str
    topic_slug: str
    talks: list[Session]


class ScheduleEvent(BaseModel):
    code: str | None = None
    event_type: str = ""
    session_type: str = ""
    rooms: list[str] = []
    title: str = ""
    start: datetime
    duration: int = 0

    @property
    def is_break(self) -> bool:
        return self.event_type == "break"

    @property
    def time(self) -> str:
        return self.start.strftime("%H:%M")

    @property
    def end_time(self) -> str:
        return (self.start + timedelta(minutes=self.duration)).strftime("%H:%M")


@dataclass
class LunchEvent:
    title: str
    url: str = ""


@dataclass
class ScheduleEntry:
    session: Session | None  # None for breaks / events without session record
    time: str
    end_time: str
    is_break: bool
    break_title: str = ""
    break_duration: int = 0
    posters: list = field(default_factory=list)  # list[Session] shown during this break
    lunch_events: list = field(default_factory=list)  # list[LunchEvent] extra events during lunch


@dataclass
class ScheduleSlot:
    start_time: str
    entries: list  # list[ScheduleEntry|None]
    is_spanning: bool


@dataclass
class ScheduleDay:
    date: str
    label: str
    short_label: str
    day_id: str
    rooms: list[str]
    slots: list  # list[ScheduleSlot]
