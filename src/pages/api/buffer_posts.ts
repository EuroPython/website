import { getCollection, getEntry } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
  const limit = Infinity;
  const speakers = await getCollection("speakers");

  const exclude = [
    "sebastian-ramirez",
    "savannah-ostrowski",
    "nerea-luis",
    "petr-baudis",
    "brett-cannon",
  ];

  const records: any[] = [];

  const charLimits: Record<string, number> = {
    instagram: 2200,
    x: 280,
    linkedin: 3000,
    bsky: 300,
    fosstodon: 500,
  };

  const message_template_full = ({
    name,
    talkTitle,
    affiliation,
    fallbackUrl,
  }: {
    name: string;
    talkTitle: string;
    affiliation: string | null;
    fallbackUrl: string;
  }) => `🚀 Exciting News: ${name} to Speak at EuroPython 2025!

I'm thrilled to announce that ${name}${affiliation ? `, renowned for their work at ${affiliation},` : ""} will be speaking at EuroPython 2025 about "${talkTitle}"!

🗓️ Event: EuroPython 2025
🔗 Details & Registration: https://ep2025.europython.eu/
👤 Speaker Profile: ${fallbackUrl}

#EuroPython2025 #Python #TechConference`;

  const message_template_short = ({
    name,
    talkTitle,
  }: {
    name: string;
    talkTitle: string;
  }) =>
    `${name} is speaking at EuroPython 2025 about "${talkTitle}"! 🎤 https://ep2025.europython.eu/ #EuroPython2025`;

  const trimToLimit = (text: string, limit: number) =>
    text.length <= limit ? text : text.slice(0, limit - 1) + "…";

  for (const speaker of speakers) {
    if (records.length >= limit) break;
    if (exclude.includes(speaker.id)) continue;

    const {
      name,
      twitter_url,
      linkedin_url,
      bluesky_url,
      mastodon_url,
      submissions,
      affiliation,
    } = speaker.data;

    const sessions = await Promise.all(
      submissions.map((session) => getEntry("sessions", session.id))
    );

    const validSessions = sessions.filter(
      (session) => session && session.data.title
    );
    if (validSessions.length === 0) continue;

    const talkTitle = validSessions[0]?.data.title || "an exciting topic";

    const speakerImage = `https://ep2025-buffer.ep-preview.click/media/social-${speaker.id}.png`;
    const fallbackUrl = `https://ep2025.europython.eu/speaker/${speaker.id}`;
    const links = {
      instagram: fallbackUrl,
      x: twitter_url ?? fallbackUrl,
      linkedin: linkedin_url ?? fallbackUrl,
      bsky: bluesky_url ?? fallbackUrl,
      fosstodon: mastodon_url ?? fallbackUrl,
    };

    const generateMessage = (platform: string) => {
      const full = message_template_full({
        name,
        talkTitle,
        affiliation,
        fallbackUrl: links[platform],
      });
      const short = message_template_short({ name, talkTitle });
      const limit = charLimits[platform];

      if (full.length <= limit) return full;
      if (short.length <= limit) return short;
      return trimToLimit(short, limit);
    };

    const record = {
      name,
      image: speakerImage,
      channel: {
        instagram: generateMessage("instagram"),
        x: generateMessage("x"),
        linkedin: generateMessage("linkedin"),
        bsky: generateMessage("bsky"),
        fosstodon: generateMessage("fosstodon"),
      },
    };

    records.push(record);
  }

  return new Response(JSON.stringify(records, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
