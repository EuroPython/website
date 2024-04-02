import { defineCollection, z } from "astro:content";

const tiers = [
  "Keystone",
  "Diamond",
  "Platinum",
  "Platinum X",
  "Gold",
  "Silver",
  "Bronze",
  "Patron",
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

export const collections = { pages, deadlines, sponsors };
