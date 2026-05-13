"""Community partner data."""

from dataclasses import dataclass


@dataclass
class CommunityPartner:
    name: str
    logo: str
    slug: str = ""
    url: str = ""
    summary: str = ""
    website: str = ""
