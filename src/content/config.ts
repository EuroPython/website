import { defineCollection, z } from "astro:content";

const page = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
});

export const collections = { page };
