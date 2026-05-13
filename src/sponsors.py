"""Sponsor data."""

from dataclasses import dataclass, field


@dataclass
class Sponsor:
    name: str
    logo: str
    slug: str = ""
    url: str = ""
    summary: str = ""
    description: str = ""
    website: str = ""
    location: str = ""
    cover: str = ""
    socials: dict[str, str] = field(default_factory=dict)


@dataclass
class SponsorTier:
    label: str
    css_class: str
    key: str = ""
    sponsors: list[Sponsor] = field(default_factory=list)


TIER_DEFS: list[SponsorTier] = [
    SponsorTier("Platinum", "tier-platinum", "platinum"),
    SponsorTier("Gold", "tier-gold", "gold"),
    SponsorTier("Silver", "tier-silver", "silver"),
    SponsorTier("Bronze", "tier-bronze", "bronze"),
    SponsorTier("Patron", "tier-patron", "patron"),
    SponsorTier("Financial Aid", "tier-finaid", "finaid"),
    SponsorTier("Supporters", "tier-supporter", "supporter"),
]
