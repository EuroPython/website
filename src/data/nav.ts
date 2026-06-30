export interface Link {
  label: string;
  url: string;
  external?: boolean;
  _hidden?: boolean;
}

export interface NavSection {
  label?: string;
  items: Link[];
}

export interface NavMenu {
  label: string;
  url: string;
  sections?: NavSection[];
  wide?: boolean;
}

export interface FooterColumn {
  title: string;
  items: Link[];
}

// ── Link registry ────────────────────────────────────────────

const L = {
  // Programme

  schedule: { label: "Schedule", url: "/schedule" },
  talks: { label: "Talks", url: "/talks" },
  tutorials: { label: "Tutorials", url: "/tutorials" },
  posters: { label: "Posters", url: "/posters" },
  tracks: { label: "Tracks", url: "/tracks" },
  speakers: { label: "Our Speakers", url: "/speakers" },
  sessions: { label: "List of all Sessions", url: "/sessions" },
  guidelines: { label: "Speaker Guidelines", url: "/guidelines" },
  mentorship: { label: "Speaker Mentorship", url: "/mentorship" },

  // Summits
  langSummit: { label: "Language Summit", url: "/language-summit" },
  rustSummit: { label: "Rust Summit", url: "/rust-summit" },
  packagingSummit: { label: "Packaging Summit", url: "/packaging-summit" },

  // Events & Social
  sprints: { label: "Sprints Weekend", url: "/sprints" },
  socialEvent: { label: "Social Event", url: "/social-event" },
  beginnersDay: { label: "Beginners' Day", url: "/beginners-day" },
  speakersDinner: { label: "Speakers' Dinner", url: "/speakers-dinner" },
  cfp: { label: "CFP & Talk Selection", url: "/cfp" },
  openSpaces: { label: "Open Spaces", url: "/open-spaces" },
  keynotes: { label: "Keynotes", url: "/keynotes" },
  cAPISummit: { label: "C-API Summit", url: "/c-api-summit" },
  wasmSummit: { label: "WASM Summit", url: "/wasm-summit" },
  pyladies: { label: "PyLadies", url: "/pyladies" },
  euroSciPy: { label: "EuroSciPy", url: "/euroscipy" },
  organisersSummit: { label: "Organisers Summit", url: "/organisers-summit" },
  beginners: { label: "Beginners", url: "/beginners" },
  lightningTalks: { label: "Lightning Talks", url: "/lightning-talks" },
  dataAI: { label: "Data & AI", url: "/data-ai" },
  inclusivity: { label: "Inclusivity", url: "/inclusivity" },
  childcare: { label: "Childcare", url: "/childcare" },
  help: { label: "Help", url: "/help" },
  discord: { label: "Discord", url: "/discord" },
  team: { label: "Our Team", url: "/team" },

  // Participate
  tickets: { label: "Tickets", url: "/tickets" },
  finaid: { label: "Financial Aid", url: "/finaid" },
  visa: { label: "Visa Information", url: "/visa" },
  volunteering: { label: "Volunteering", url: "/volunteering" },
  faq: { label: "FAQ", url: "/faq" },
  coc: {
    label: "Code of Conduct",
    url: "https://www.europython-society.org/coc/",
    external: true,
  },
  accessibility: { label: "Accessibility", url: "/accessibility" },

  // Venue
  venue: { label: "Venue", url: "/venue" },
  krakow: { label: "Tips", url: "/tips" },
  hotels: { label: "Hotels", url: "/hotels" },

  // Sponsorship
  ourSponsors: { label: "Our Sponsors", url: "/sponsors" },
  sponsorPkg: { label: "Sponsor Packages", url: "/sponsorship/sponsor" },
  sponsorInfo: {
    label: "Sponsor Information",
    url: "/sponsorship/information",
  },

  // Community
  about: { label: "About EuroPython", url: "/about" },
  eps: {
    label: "EuroPython Society",
    url: "https://europython-society.org/",
    external: true,
  },
  communityPartners: {
    label: "Community Partners",
    url: "/community-partners",
  },
  mediaPartners: {
    label: "Media Partners",
    url: "/media-partners",
  },

  // Misc
  jobs: { label: "Jobs", url: "/jobs" },
  contacts: { label: "Contacts", url: "/contacts" },
  terms: { label: "Terms", url: "/terms" },
  privacy: {
    label: "Privacy Policy",
    url: "https://www.europython-society.org/privacy/",
    external: true,
  },
  blog: {
    label: "EuroPython Blog",
    url: "https://blog.europython.eu/",
    external: true,
  },
  anniversary: {
    label: "Anniversary Challenge",
    url: "https://ep2026.europython.eu/25anniversary",
    external: true,
  },
  yearsOfEp: { label: "25 Years of EuroPython", url: "/25yearsofep" },
};

// ── Nav menus ────────────────────────────────────────────────

export const NAV_MENUS: NavMenu[] = [
  // Programme — rich multi-column with labelled sections
  {
    label: "Programme",
    url: "/schedule",
    wide: true,
    sections: [
      {
        label: "Sessions",
        items: [
          L.keynotes,
          L.talks,
          L.tutorials,
          L.posters,
          L.lightningTalks,
          L.openSpaces,
          L.dataAI,
        ],
      },
      {
        label: "Summits",
        items: [
          L.langSummit,
          L.cAPISummit,
          L.packagingSummit,
          L.rustSummit,
          L.wasmSummit,
        ],
      },
      {
        label: "Community",
        items: [L.pyladies, L.euroSciPy, L.organisersSummit],
      },
      {
        label: "Events & Social",
        items: [
          L.sprints,
          L.socialEvent,
          L.beginnersDay,
          L.beginners,
          L.yearsOfEp,
        ],
      },
    ],
  },

  // Attend — wide dropdown with 4 columns
  {
    label: "Attend",
    url: "/tickets",
    wide: true,
    sections: [
      {
        label: "Registration",
        items: [L.tickets, L.finaid, L.visa, L.hotels],
      },
      {
        label: "Speakers",
        items: [
          L.speakers,
          L.guidelines,
          L.mentorship,
          L.cfp,
          L.speakersDinner,
        ],
      },
      {
        label: "Community",
        items: [L.volunteering, L.inclusivity, L.accessibility],
      },
      {
        label: "Support",
        items: [L.childcare, L.help, L.faq, L.coc],
      },
    ],
  },

  // Venue — single link, no dropdown
  {
    label: "Venue",
    url: "/venue",
  },

  // Sponsors — single link, no dropdown
  {
    label: "Sponsors",
    url: "/sponsors",
  },

  // About — simple flat list
  {
    label: "Community",
    url: "/about",
    wide: true,
    sections: [
      {
        label: "Organization",
        items: [
          L.about,
          L.team,
          L.communityPartners,
          L.mediaPartners,
          L.sponsorPkg,
          L.sponsorInfo,
        ],
      },
      {
        label: "Online",
        items: [L.blog, L.eps],
      },
      {
        items: [],
      },
      {
        items: [],
      },
    ],
  },
];

// ── Social links ────────────────────────────────────────────

export const SOCIALS: Record<string, string> = {
  mastodon: "https://fosstodon.org/@europython",
  linkedin: "https://www.linkedin.com/company/europython",
  github: "https://github.com/europython",
  bluesky: "https://bsky.app/profile/europython.eu",
  twitter: "https://x.com/europython",
  instagram: "https://www.instagram.com/europython/",
  youtube: "https://www.youtube.com/channel/UC98CzaYuFNAA_gOINFB0e4Q",
  tiktok: "https://www.tiktok.com/@europython",
};

export const TERMS: Link[] = [
  { label: "Contacts", url: "/contacts" },
  { label: "Terms", url: "/terms" },
  {
    label: "Code of Conduct",
    url: "https://www.europython-society.org/coc/",
    external: true,
  },
  {
    label: "Privacy Policy",
    url: "https://www.europython-society.org/privacy/",
    external: true,
  },
];

// ── Footer columns ───────────────────────────────────────────

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Quick links",
    items: [L.tickets, L.krakow, L.visa],
  },
  {
    title: "Schedule",
    items: [
      L.schedule,
      L.talks,
      L.tutorials,
      L.posters,
      L.tracks,
      L.speakers,
      L.guidelines,
      L.mentorship,
    ],
  },
  {
    title: "Events",
    items: [
      L.sprints,
      L.socialEvent,
      L.beginnersDay,
      L.speakersDinner,
      L.openSpaces,
      L.langSummit,
      L.rustSummit,
      L.packagingSummit,
    ],
  },
  {
    title: "Sponsors",
    items: [L.ourSponsors, L.sponsorPkg, L.sponsorInfo, L.jobs],
  },
  {
    title: "Community",
    items: [
      L.about,
      L.eps,
      L.communityPartners,
      L.mediaPartners,
      L.blog,
      L.contacts,
    ],
  },
];
