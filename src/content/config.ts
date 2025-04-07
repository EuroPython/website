import { defineCollection, reference, z } from "astro:content";
import { file } from "astro/loaders";

const tiers = [
  "Keystone",
  "Diamond",
  "Platinum",
  "Platinum X",
  "Gold",
  "Silver",
  "Bronze",
  "Patron",
  "Financial Aid",
  "Supporters",
] as const;

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
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

const sponsors = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string(),
      image: image(),
      tier: z.enum(tiers),
    }),
});

const keynoters = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string().optional(),
      image: image(),
      order: z.number(),
    }),
});

// Cache for fetched data to prevent duplicate network requests
let cachedSpeakersData: any = null;
let cachedSessionsData: any = null;

// Shared data fetching function
async function getCollectionsData() {
  // Only fetch if not already cached
  if (!cachedSpeakersData || !cachedSessionsData) {
    const [speakersResponse, sessionsResponse] = await Promise.all([
      fetch(
        "https://gist.github.com/egeakman/469f9abb23a787df16d8787f438dfdb6/raw/62d2b7e77c1b078a0e27578c72598a505f9fafbf/speakers.json"
      ),
      fetch(
        "https://gist.githubusercontent.com/egeakman/eddfb15f32ae805e8cfb4c5856ae304b/raw/466f8c20c17a9f6c5875f973acaec60e4e4d0fae/sessions.json"
      ),
    ]);

    cachedSpeakersData = await speakersResponse.json();
    cachedSessionsData = await sessionsResponse.json();
  }

  // Create indexed versions for efficient lookups
  const speakersById = Object.entries(cachedSpeakersData).reduce(
    (acc, [id, speaker]: [string, any]) => {
      acc[id] = { id, ...speaker };
      return acc;
    },
    {} as Record<string, any>
  );

  const sessionsById = Object.entries(cachedSessionsData).reduce(
    (acc, [id, session]: [string, any]) => {
      acc[id] = { id, ...session };
      return acc;
    },
    {} as Record<string, any>
  );

  return {
    speakersData: cachedSpeakersData,
    sessionsData: cachedSessionsData,
    speakersById,
    sessionsById,
  };
}

const speakers = defineCollection({
  loader: async (): Promise<any> => {
    const { speakersData, sessionsById } = await getCollectionsData();

    return Object.values(speakersData).map((speaker: any) => ({
      id: speaker.slug,
      ...speaker,
      submissions: (speaker.submissions || [])
        .filter((sessionId: string) => sessionId in sessionsById)
        .map((sessionId: string) => sessionsById[sessionId].slug),
    }));
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
    gitx: z.string().nullable(),
    linkedin_url: z.string().url().nullable(),
    mastodon_url: z.string().url().nullable(),
    twitter_url: z.string().url().nullable(),
  }),
});

const sessions = defineCollection({
  loader: async (): Promise<any> => {
    const { sessionsData, speakersById } = await getCollectionsData();

    return Object.values(sessionsData).map((session: any) => ({
      id: session.slug,
      ...session,
      speakers: (session.speakers || [])
        .filter((speakerId: string) => speakerId in speakersById)
        .map((speakerId: string) => speakersById[speakerId].slug),
    }));
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

const days = defineCollection({
  type: "data",
  schema: z.object({
    rooms: z.array(z.string()),
    events: z.array(
      z.object({
        rooms: z.array(z.string()),
        event_type: z.string(),
        code: z.string().optional(),
        title: z.string(),
        slug: z.string().optional(),
        session_type: z.string().optional(), // why?
        speakers: z
          .array(
            z.object({
              code: z.string(),
              name: z.string(),
              website_url: z.string(),
            })
          )
          .optional(),
        tweet: z.string().optional().nullable(),
        level: z.string().optional().nullable(),
        start: z.string(),
        website_url: z.string().optional().nullable(),
        duration: z.number(),
      })
    ),
  }),
});

export const collections = {
  days,
  pages,
  deadlines,
  sponsors,
  sessions,
  speakers,
  keynoters,
};
