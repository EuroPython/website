import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { defineCollection, reference, z } from "astro:content";
import { loadData } from "@utils/dataLoader";
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
      disabled: z.boolean().optional(),
    }),
});

const week = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      weekdays: z.string(),
      button: z.string(),
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
      bio: z.string().optional(),
      image: image().optional(),
      order: z.number(),
      homepage: z.string().url().optional(),
      mastodon_url: z.string().url().optional(),
      bluesky_url: z.string().url().optional(),
      twitter_url: z.string().url().optional(),
      linkedin_url: z.string().url().optional(),
      github_url: z.string().url().optional(),
    }),
});

async function getCollectionsData() {
  const [speakersData, sessionsData] = await Promise.all([
    loadData(import.meta.env.EP_SPEAKERS_API),
    loadData(import.meta.env.EP_SESSIONS_API),
  ]);

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

    // Load keynoter entries from markdown files
    const keynoterDir = join(process.cwd(), "src/content/keynoters");
    const keynoterFiles = readdirSync(keynoterDir).filter((f: string) =>
      f.endsWith(".md")
    );
    const keynoterEntries = keynoterFiles.map((f: string) => {
      const content = readFileSync(join(keynoterDir, f), "utf-8");
      const parts = content.split("---");
      const frontmatter: any = {};
      const bodyParts: string[] = [];
      if (parts.length >= 3) {
        // Parse YAML frontmatter (basic key: value)
        parts[1].split("\n").forEach((line: string) => {
          const m = line.match(/^\s*([\w-]+):\s*"?([^"]*)"?\s*$/);
          if (m) frontmatter[m[1].trim()] = m[2].trim();
        });
        // Body text after second ---
        bodyParts.push(parts.slice(2).join("---").trim());
      }
      const slug = f.replace(/\.md$/, "");
      return { slug, data: frontmatter, body: bodyParts.join("\n") };
    });

    const apiSpeakers = Object.values(speakersData as Record<string, {}>).map(
      (speaker: any) => ({
        id: speaker.slug,
        ...speaker,
        submissions: (speaker.submissions || [])
          .filter((sessionId: string) => sessionId in sessionsById)
          .map((sessionId: string) => sessionsById[sessionId].slug),
      })
    );

    // Add virtual entries for keynoters not in the API
    const apiNames = new Set(
      apiSpeakers.map((s: any) => s.name?.toLowerCase())
    );

    const imgExts = ["jpg", "png", "webp"];

    for (const k of keynoterEntries) {
      const name = k.data?.name;
      if (!name) continue;

      if (!apiNames.has(name.toLowerCase())) {
        const nameSlug = name
          .replace(/[\u0141\u0142]/g, "l")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        apiSpeakers.push({
          id: nameSlug,
          code: nameSlug,
          name: name,
          slug: nameSlug,
          avatar: ["jpg", "png", "webp"].reduce(
            (found: string | null, ext: string) => {
              try {
                if (
                  existsSync(
                    join(
                      process.cwd(),
                      "src/content/keynoters",
                      k.slug + "." + ext
                    )
                  )
                )
                  return "/content/keynoters/" + k.slug + "." + ext;
              } catch {}
              return found;
            },
            null
          ),
          biography: (k as any).body || k.data?.bio || null,
          submissions: [],
          affiliation: null,
          homepage: k.data?.homepage || null,
          gitx_url: k.data?.github_url || null,
          linkedin_url: k.data?.linkedin_url || null,
          mastodon_url: k.data?.mastodon_url || null,
          bluesky_url: k.data?.bluesky_url || null,
          twitter_url: k.data?.twitter_url || null,
          discord: null,
          tiktok: null,
        });
      }
    }

    return apiSpeakers;
  },
  schema: z.object({
    code: z.string(),
    name: z.string(),
    slug: z.string(),
    avatar: z.string().nullable(),
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

const tracks = defineCollection({
  loader: async (): Promise<any[]> => {
    const { sessionsData } = await getCollectionsData();
    const trackSet = new Set<string>();
    Object.values(sessionsData as Record<string, any>).forEach((s: any) => {
      if (s.track) trackSet.add(s.track);
    });
    return Array.from(trackSet)
      .sort()
      .map((track, i) => ({
        id: track
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        name: track,
        order: i,
      }));
  },
  schema: z.object({
    name: z.string(),
    order: z.number(),
  }),
});

interface ScheduleData {
  days: Record<string, any>;
}

const days = defineCollection({
  loader: async (): Promise<any[]> => {
    const schedule = (await loadData(
      import.meta.env.EP_SCHEDULE_API
    )) as ScheduleData;

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
        blog: z.string().url().optional().nullable(),
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
    logo_max_width: z.string().optional(),
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
    responsibilities: z
      .array(z.union([z.string(), z.record(z.array(z.string()))]))
      .nullable(),
    min_requirements: z.array(z.string()).optional().nullable(),
    requirements: z.array(z.string()).nullable(),
    preferred: z.array(z.string()).optional().nullable(),
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
  tracks,
  sponsors,
  jobs,
};
