"""Single source of truth for all nav/footer links."""

from dataclasses import dataclass


@dataclass
class Link:
    label: str
    url: str
    external: bool = False


class L:
    """All links — single source of truth."""

    # Programme
    schedule = Link("Schedule", "/schedule/")
    keynotes = Link("Keynotes", "/programme/#keynotes")
    talks = Link("Talks", "/talks/")
    tutorials = Link("Tutorials", "/tutorials/")
    posters = Link("Posters", "/posters/")
    lightning_talks = Link("Lightning Talks", "/programme/#lightning-talks")
    speakers = Link("Speakers", "/programme_speakers/")
    selection_process = Link("CFP & Talk Selection", "/programme_selection/")

    # Summits
    lang_summit = Link("Language Summit", "/programme/#lang-summit")
    capi_summit = Link("C-API Summit", "/programme/#capi-summit")
    pkg_summit = Link("Packaging Summit", "/programme/#pkg-summit")
    rust_summit = Link("Rust Summit", "/programme/#rust-summit")
    wasm_summit = Link("WASM Summit", "/programme/#wasm-summit")

    # Community
    pyladies = Link("PyLadies", "/programme/#pyladies")
    euroscipy = Link("EuroSciPy", "#euroscipy")
    orgsummit = Link("Organisers Summit", "/programme/#orgsummit")

    # Curated pages
    beginners = Link("Beginners", "/beginners/")
    data_ai = Link("Data & AI", "/data/")

    # Events & Social
    sprints = Link("Sprints Weekend", "/sprints/")
    social_event = Link("Social Event", "/social_event/")
    beginners_day = Link("Beginners' Day", "/beginners/")
    open_spaces = Link("Open Spaces", "/programme/#open-spaces")
    speakers_dinner = Link("Speakers' Dinner", "/speakers_dinner/")
    speaker_guide = Link("Speaker Guidelines", "/guidelines/")
    speaker_mentorship = Link("Speaker Mentorship", "/mentorship/")

    # Participate
    tickets = Link("Tickets", "/participate/#tickets")
    finaid = Link("Financial Aid", "/participate/#finaid")
    visa = Link("Visa Support", "/participate/#visa")
    volunteering = Link("Volunteering", "/participate/#volunteering")

    # Inclusivity / Help
    accessibility = Link("Accessibility", "/accessibility/")
    childcare = Link("Childcare", "/childcare/")
    coc = Link("Code of Conduct", "https://www.europython-society.org/coc/", external=True)
    faq = Link("FAQ", "/participate/#faq")
    discord = Link("Discord", "https://discord.gg/europython", external=True)

    # Venue
    krakow = Link("Discover Kraków", "/venue/#krakow")
    ice_venue = Link("ICE Congress Center", "/venue/#ice-venue")
    hotels = Link("Hotels", "/hotels/")

    # Sponsorship
    our_sponsors = Link("Our Sponsors", "/sponsorship/#sponsors")
    become_sponsor = Link("Become a Sponsor", "/sponsorship/#sponsor-packages")
    sponsor_info = Link("Sponsor Information", "/sponsorship/information")
    jobs_board = Link("Jobs Board", "/sponsorship/#jobs")

    # About
    about_ep = Link("About EuroPython", "/community/#about")
    team = Link("Team", "/community/#team")
    community_partners = Link("Community Partners", "/community/#community-partners")

    # External
    eps = Link("EuroPython Society", "https://europython-society.org/", external=True)
    eps_short = Link("EPS", "https://europython-society.org/")
    blog = Link("Blog", "https://blog.europython.eu/", external=True)
    contact = Link("Contact", "/contacts/")


@dataclass
class NavSection:
    items: list[Link]
    label: str = ""
    column: int = 0


@dataclass
class NavMenu:
    label: str
    url: str
    sections: list[NavSection]
    wide: bool = False


@dataclass
class FooterColumn:
    title: str
    items: list[Link]


# Nav menus
# ========

NAV_MENUS: list[NavMenu] = [
    NavMenu(
        "Programme",
        "/programme/",
        wide=True,
        sections=[
            NavSection(
                label="Talks & Schedule",
                column=1,
                items=[
                    L.schedule,
                    L.keynotes,
                    L.talks,
                    L.tutorials,
                    L.posters,
                    L.lightning_talks,
                    L.speakers,
                    L.open_spaces,
                    L.data_ai,
                ],
            ),
            NavSection(
                label="Summits",
                column=2,
                items=[
                    L.lang_summit,
                    L.capi_summit,
                    L.pkg_summit,
                    L.rust_summit,
                    L.wasm_summit,
                ],
            ),
            NavSection(
                label="Community",
                column=2,
                items=[
                    L.pyladies,
                    L.euroscipy,
                    L.orgsummit,
                ],
            ),
            NavSection(
                label="Events & Social",
                column=3,
                items=[
                    L.sprints,
                    L.social_event,
                    L.beginners_day,
                    L.beginners,
                ],
            ),
            NavSection(
                label="For Speakers",
                column=3,
                items=[
                    L.selection_process,
                    L.speaker_guide,
                    L.speaker_mentorship,
                    L.speakers_dinner,
                ],
            ),
        ],
    ),
    NavMenu(
        "Participate",
        "/participate/",
        sections=[
            NavSection(
                items=[
                    L.tickets,
                    L.finaid,
                    L.visa,
                    L.volunteering,
                ]
            ),
            NavSection(
                label="Inclusivity",
                items=[
                    L.accessibility,
                    L.childcare,
                    L.coc,
                ],
            ),
            NavSection(
                label="Help",
                items=[
                    L.faq,
                    L.discord,
                ],
            ),
        ],
    ),
    NavMenu(
        "Venue",
        "/venue/",
        sections=[
            NavSection(
                items=[
                    L.krakow,
                    L.ice_venue,
                    L.hotels,
                ]
            ),
        ],
    ),
    NavMenu(
        "Sponsor",
        "/sponsorship/",
        sections=[
            NavSection(
                items=[
                    L.our_sponsors,
                    L.become_sponsor,
                    L.sponsor_info,
                    L.jobs_board,
                ]
            ),
        ],
    ),
    NavMenu(
        "Community",
        "/community/",
        sections=[
            NavSection(
                items=[
                    L.about_ep,
                    L.team,
                    L.community_partners,
                ]
            ),
            NavSection(
                label="External",
                items=[
                    L.eps,
                    L.blog,
                    L.contact,
                ],
            ),
        ],
    ),
    NavMenu(
        "Jobs",
        "#",
        sections=[],
    ),
]

# Footer columns
# ==============

FOOTER_COLUMNS: list[FooterColumn] = [
    FooterColumn(
        "Talks & Schedule",
        [
            L.schedule,
            L.keynotes,
            L.talks,
            L.tutorials,
            L.posters,
            L.lightning_talks,
            L.speakers,
            L.open_spaces,
            L.beginners,
            L.data_ai,
        ],
    ),
    FooterColumn(
        "Summits & Community",
        [
            L.lang_summit,
            L.capi_summit,
            L.pkg_summit,
            L.rust_summit,
            L.wasm_summit,
            L.pyladies,
            L.euroscipy,
            L.orgsummit,
        ],
    ),
    FooterColumn(
        "Events & Social",
        [
            L.sprints,
            L.social_event,
            L.beginners_day,
            L.selection_process,
            L.speaker_guide,
            L.speaker_mentorship,
            L.speakers_dinner,
        ],
    ),
    FooterColumn(
        "Participate",
        [
            L.tickets,
            L.finaid,
            L.visa,
            L.volunteering,
            L.coc,
            L.faq,
        ],
    ),
    FooterColumn(
        "Venue",
        [
            L.krakow,
            L.ice_venue,
            L.hotels,
        ],
    ),
    FooterColumn(
        "Sponsorship",
        [
            L.our_sponsors,
            L.become_sponsor,
            L.sponsor_info,
            L.jobs_board,
        ],
    ),
    FooterColumn(
        "About",
        [
            L.about_ep,
            L.team,
            L.community_partners,
            L.eps_short,
            L.contact,
        ],
    ),
]
