import { defineCollection, reference, z } from "astro:content";

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
      url: z.string(),
      tagline: z.string().optional(),
      image: image(),
    }),
});

const speakers = defineCollection({
  type: "content",
  schema: z.object({
    code: z.string(),
    name: z.string(),
    avatar: z.string(),
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
  type: "content",
  schema: z.object({
    code: z.string(),
    title: z.string(),
    speakers: z.array(reference("speakers")),
    session_type: z.string(),
    track: z.string().nullable(),
    state: z.enum(["confirmed"]).optional().nullable(),
    tweet: z.string(),
    duration: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    delivery: z.enum(["in-person", "remote"]),
    room: z.string().nullable(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    website_url: z.string().url(),
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
