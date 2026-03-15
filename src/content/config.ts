import { defineCollection, reference, z } from "astro:content";
// import { loadData } from "@utils/dataLoader";
import { glob } from "astro/loaders";

const mode = import.meta.env.MODE;
console.log(`\x1b[35m[EP]\x1b[0m Current MODE: \x1b[1m\x1b[34m${mode}\x1b[0m`);

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    toc: z.boolean().optional().default(true),
    full: z.boolean().optional().default(false),
  }),
});

const deadlines = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      url: z.string(),
      image: image(),
    }),
});

const week = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      url: z.string(),
      image: image(),
    }),
});

const keynoters = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string().optional(),
      tagline: z.string().optional(),
      image: image(),
      order: z.number(),
    }),
});

async function getCollectionsData() {
  // TODO: Re-enable when the API is available
  // const speakersData = await loadData(import.meta.env.EP_SPEAKERS_API);
  // const sessionsData = await loadData(import.meta.env.EP_SESSIONS_API);
  const speakersData = {};
  const sessionsData = {};

  const speakersById = Object.entries(
    speakersData as Record<string, {}>
  ).reduce(
    (acc, [id, speaker]: [string, any]) => {
      acc[id] = { id, ...speaker };
      return acc;
    },
    {} as Record<string, any>
  );

  const sessionsById = Object.entries(
    sessionsData as Record<string, {}>
  ).reduce(
    (acc, [id, session]: [string, any]) => {
      acc[id] = { id, ...session };
      return acc;
    },
    {} as Record<string, any>
  );

  return {
    speakersData,
    sessionsData,
    speakersById,
    sessionsById,
  };
}

const speakers = defineCollection({
  loader: async (): Promise<any> => {
    const { speakersData, sessionsById } = await getCollectionsData();

    return Object.values(speakersData as Record<string, {}>).map(
      (speaker: any) => ({
        id: speaker.slug,
        ...speaker,
        submissions: (speaker.submissions || [])
          .filter((sessionId: string) => sessionId in sessionsById)
          .map((sessionId: string) => sessionsById[sessionId].slug),
      })
    );
  },
  schema: z.object({
    code: z.string(),
    name: z.string(),
    slug: z.string(),
    avatar: z.string(),
    biography: z.string().nullable(),
    submissions: z.array(reference("sessions")),
    affiliation: z.string().nullable(),
    homepage: z.string().nullable(),
    gitx_url: z.string().url().nullable().optional(),
    linkedin_url: z.string().url().nullable(),
    mastodon_url: z.string().url().nullable(),
    bluesky_url: z.string().url().nullable().optional(),
    twitter_url: z.string().url().nullable(),
    discord: z.string().url().nullable().optional(),
    tiktok: z.string().url().nullable().optional(),
  }),
});

const sessions = defineCollection({
  loader: async (): Promise<any> => {
    const { sessionsData, speakersById } = await getCollectionsData();

    return Object.values(sessionsData as Record<string, {}>).map(
      (session: any) => ({
        id: session.slug,
        ...session,
        speakers: (session.speakers || [])
          .filter((speakerId: string) => speakerId in speakersById)
          .map((speakerId: string) => speakersById[speakerId].slug),
      })
    );
  },
  schema: z.object({
    code: z.string(),
    title: z.string(),
    slug: z.string(),
    abstract: z.string().nullable(),
    speakers: z.array(reference("speakers")),
    session_type: z.string(),
    track: z.string().nullable(),
    state: z.enum(["confirmed"]).optional().nullable(),
    tweet: z.string(),
    resources: z
      .array(z.object({ resource: z.string().url(), description: z.string() }))
      .nullable(),
    duration: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    delivery: z.enum(["in-person", "remote", ""]),
    room: z.string().nullable(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    website_url: z.string().url(),
    youtube_url: z.string().url().nullable(),
    sessions_in_parallel: z.array(z.string()).nullable(),
    sessions_after: z.array(z.string()).nullable(),
    sessions_before: z.array(z.string()).nullable(),
    next_session: z.string().nullable(),
    prev_session: z.string().nullable(),
  }),
});

interface ScheduleData {
  days: Record<string, any>;
}

const days = defineCollection({
  loader: async (): Promise<any[]> => {
    // TODO: Re-enable when the API is available
    // const schedule = (await loadData(
    //   import.meta.env.EP_SCHEDULE_API
    // )) as ScheduleData;
    const schedule = null as ScheduleData | null;

    if (!schedule || Object.keys(schedule).length === 0) {
      return [];
    }

    return Object.entries(schedule.days).map(([date, data]: [string, any]) => ({
      id: date,
      ...data,
    }));
  },
  schema: z.object({
    id: z.string(),
    rooms: z.array(z.string()).optional(),
    events: z.array(
      z.object({
        code: z.string().optional(),
        duration: z.number(),
        event_type: z.string(),
        level: z.string().optional().nullable(),
        rooms: z.array(z.string()),
        session_type: z.string().optional(),
        slug: z.string().optional(),
        speakers: z
          .array(
            z.object({
              code: z.string(),
              name: z.string(),
              website_url: z.string(),
            })
          )
          .optional(),
        start: z.string(),
        title: z.string(),
        track: z.string().optional().nullable(),
        tweet: z.string().optional().nullable(),
        website_url: z.string().optional().nullable(),
      })
    ),
  }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/sponsors" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    tier: z.string(),
    location: z.string().optional(),
    industry: z.string().optional(),
    description: z.string().optional(),
    socials: z
      .object({
        linkedin: z.string().url().optional().nullable(),
        github: z.string().url().optional().nullable(),
        mastodon: z.string().url().optional().nullable(),
        bluesky: z.string().url().optional().nullable(),
        twitter: z.string().url().optional().nullable(),
        instagram: z.string().url().optional().nullable(),
        discord: z.string().url().optional().nullable(),
        facebook: z.string().url().optional().nullable(),
        youtube: z.string().url().optional().nullable(),
        tiktok: z.string().url().optional().nullable(),
      })
      .optional(),
    event_name: z.string().optional().nullable(),
    logo_padding: z.string().optional(),
    draft: z.boolean().optional().default(false),
    jobs: z.array(reference("jobs")).optional().default([]),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: "*/!(index).md", base: "./src/content/sponsors" }),
  schema: z.object({
    title: z.string(),
    location: z.string().nullable(),
    type: z.string().nullable(), // e.g., Full-Time
    level: z.string().nullable(), // e.g., Senior
    salary: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
    description: z.string().nullable(),
    responsibilities: z.array(z.string()).nullable(),
    min_requirements: z.array(z.string()).optional().nullable(),
    requirements: z.array(z.string()).nullable(),
    preffered: z.array(z.string()).optional().nullable(),
    stack: z.array(z.string()).optional().nullable(),
    benefits: z.array(z.string()).nullable(),
    description2: z.string().optional().nullable(),
    apply_link: z.string().url().optional(),
    draft: z.boolean().optional().default(false),
    sponsor: reference("sponsors").optional(),
  }),
});

const sprints = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // Auto-generated from filename if not provided
    numberOfPeople: z.string().or(z.number()),
    pythonLevel: z.enum(["Any", "Beginner", "Intermediate", "Advanced"]),
    contactPerson: z.object({
      name: z.string(),
      email: z.string().email().optional().nullable(),
      github: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
    }),
    links: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  days,
  pages,
  deadlines,
  week,
  sessions,
  speakers,
  sprints,
  keynoters,
  sponsors,
  jobs,
};
