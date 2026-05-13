"""Keynote speaker data."""

from dataclasses import dataclass


@dataclass
class Keynote:
    name: str
    role: str
    bio: str
    photo: str  # local path relative to site root, e.g. "keynotes/sebastian-ramirez.webp"
    is_placeholder: bool = False
    session_code: str = ""  # pretalx code, resolved to url at build time
    session_url: str = ""


KEYNOTES: list[Keynote] = [
    Keynote(
        "Sebastián Ramírez",
        "Creator of FastAPI & Typer",
        "Built FastAPI, now one of the most starred Python projects on GitHub."
        " A tireless advocate for developer experience, type hints,"
        " and async Python done right.",
        "keynotes/sebastian-ramirez.webp",
        session_code="DCBMJY",
    ),
    Keynote(
        "Brett Cannon",
        "CPython Core Developer & 5th most prolific PEP author",
        "Python core developer for over 20 years, Steering Council member,"
        " Microsoft engineer. Has shaped Python's direction and community"
        " health more than almost anyone alive.",
        "keynotes/brett-cannon.webp",
        session_code="FCGVPR",
    ),
    Keynote(
        "Savannah Ostrowski",
        "CPython Core Developer & JIT Maintainer",
        "Python core developer working on the experimental JIT compiler"
        " introduced in CPython 3.13. Driving Python performance into"
        " a new era, one bytecode at a time.",
        "keynotes/savannah-ostrowski.webp",
        session_code="SLSM8T",
    ),
    Keynote(
        "Nerea Luis",
        "Award-winning AI Consultant & Cofounder, Lumi Labs",
        "One of Spain's most recognised voices on ethical and responsible AI."
        " Brings a rare combination of technical depth and public communication"
        " to the hardest questions in machine learning.",
        "keynotes/nerea-luis.webp",
        session_code="YEKGVY",
    ),
    Keynote(
        "Mystery Keynote #5",
        "To be announced",
        "Who will it be? Stay tuned — we'll reveal our fifth keynote speaker"
        " soon. Follow us on social media to be the first to know.",
        "",
        is_placeholder=True,
    ),
    Keynote(
        "Mystery Keynote #6",
        "To be announced",
        "Our final keynote slot is reserved for someone special. Watch this space — the announcement is coming.",
        "",
        is_placeholder=True,
    ),
]
