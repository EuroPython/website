import { getCollection, getEntry } from "astro:content";
import type { APIRoute } from "astro";

// Get @username from Twitter URL
function getTwitterUsername(url: string): string | undefined {
  if (!url) return undefined;
  const username = url.split("/").pop();
  return (username ?? url).startsWith("@") ? username : `@${username}`;
}

// Get @username from Bluesky URL
function getBlueskyUsername(url: string): string | undefined {
  if (!url) return undefined;
  const username = url.split("/").pop()?.replace(/^@/, "");
  return username ? `@${username}` : undefined;
}

// Get Bluesky profile link from username
// Get @username@instance.tld from Mastodon URL
function getMastodonUsername(url: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/https?:\/\/([^\/]+)\/@([^\/]+)(\/|\?|$)/);
  return match ? `@${match[2]}@${match[1]}` : undefined;
}

function getLinkedInUsernameHandler(url: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/https?:\/\/([^\/]+)\/in\/([^\/]+)(\/|\?|$)/);
  if (match) {
    try {
      return `https://www.linkedin.com/in/${decodeURIComponent(match[2])}`;
    } catch {
      return `https://www.linkedin.com/in/${match[2]}`;
    }
  }
  return undefined;
}

export const GET: APIRoute = async () => {
  const limit = Infinity;
  const speakers = await getCollection("speakers");
  const sessions = await getCollection("sessions");

  // Dynamically derive keynote speaker slugs from the sessions collection
  // so this list stays accurate as the programme is updated
  const keynoteSpeakerIds = new Set(
    sessions
      .filter((s) => s.data.session_type?.toLowerCase() === "keynote")
      .flatMap((s) => s.data.speakers.map((ref) => ref.id))
  );

  const records: any[] = [];

  const charLimits: Record<string, number> = {
    instagram: 2200,
    x: 280,
    linkedin: 3000,
    bsky: 300,
    fosstodon: 500,
  };

  // Tailor message templates for each platform using appropriate handle formats
  const message_template = {
    instagram: ({ name, talkTitle }) =>
      `Join ${name} at EuroPython for "${talkTitle}".`,

    x: ({ name, handle, talkTitle, talkUrl }) =>
      handle
        ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}" talk: ${talkUrl}`
        : `Join ${name} at EuroPython for "${talkTitle}" talk: ${talkUrl}`,

    linkedin: ({ name, talkTitle }) =>
      `Join ${name} at EuroPython for "${talkTitle}".`,

    bsky: ({ name, handle, talkTitle, talkUrl }) =>
      handle
        ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}" talk: ${talkUrl}`
        : `Join ${name} at EuroPython for "${talkTitle}" talk: ${talkUrl}`,

    fosstodon: ({ name, handle, talkTitle, talkUrl }) =>
      handle
        ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}" talk: ${talkUrl}`
        : `Join ${name} at EuroPython for "${talkTitle}" talk: ${talkUrl}`,
  };

  const trimToLimit = (text: string, limit: number) =>
    text.length <= limit ? text : text.slice(0, limit - 1) + "…";

  for (const speaker of speakers) {
    if (records.length >= limit) break;
    if (keynoteSpeakerIds.has(speaker.id)) continue;

    const {
      name,
      twitter_url,
      linkedin_url,
      bluesky_url,
      mastodon_url,
      submissions,
    } = speaker.data;

    const sessions = await Promise.all(
      submissions.map((session) => getEntry("sessions", session.id))
    );

    const validSessions = sessions.filter(
      (session) => session && session.data.title
    );

    if (validSessions.length === 0) continue;

    const talkTitle = validSessions[0]?.data.title || "an exciting topic";
    const talkCode = validSessions[0]?.data.code;
    const talkUrl = `https://ep2026.europython.eu/${talkCode}`;
    const speakerImage = `https://ep2026.europython.eu/media/social-${speaker.id}.png`;
    const fallbackUrl = `https://ep2026.europython.eu/speaker/${speaker.id}`;

    // Extract handles for each platform
    const handles = {
      x: getTwitterUsername(twitter_url || ""),
      linkedin: getLinkedInUsernameHandler(linkedin_url || ""),
      bsky: getBlueskyUsername(bluesky_url || ""),
      fosstodon: getMastodonUsername(mastodon_url || ""),
    };

    // Generate appropriate messages for each platform
    const generateMessage = (platform: keyof typeof message_template) => {
      const templateFn = message_template[platform];
      const handle =
        platform === "instagram"
          ? undefined
          : handles[platform as keyof typeof handles];

      const full = templateFn({
        name,
        handle,
        talkTitle,
        talkUrl: platform === "instagram" ? fallbackUrl : talkUrl,
      });

      const limit = charLimits[platform];
      return trimToLimit(full, limit);
    };

    const record = {
      name,
      image: speakerImage,
      handles: handles,
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
