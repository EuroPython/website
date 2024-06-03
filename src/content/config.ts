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
    twitter_url: z.string().nullable(),
    mastodon_url: z.string().nullable(),
  }),
});

const sessions = defineCollection({
  type: "content",
  schema: z.object({
    code: z.string(),
    title: z.string(),
    speakers: z.array(reference("speakers")),
    submission_type: z.string(),
    track: z.string().nullable(),
    state: z.enum(["confirmed"]),
    tweet: z.string(),
    duration: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced", ""]),
    delivery: z.enum(["in-person", "remote", ""]),
    room: z.string().nullable(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    talks_in_parallel: z.array(z.string()).nullable(),
    talks_after: z.array(z.string()).nullable(),
    next_talk: z.string().nullable(),
    prev_talk: z.string().nullable(),
    website_url: z.string().url(),
  }),
});

export const collections = {
  pages,
  deadlines,
  sponsors,
  sessions,
  speakers,
  keynoters,
};
