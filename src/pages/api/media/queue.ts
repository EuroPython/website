import { getCollection, getEntry } from "astro:content";
import type { APIRoute } from "astro";

// ── helpers ────────────────────────────────────────────────────────────────

function getTwitterUsername(url: string): string | undefined {
  if (!url) return undefined;
  const username = url.split("/").pop();
  return (username ?? url).startsWith("@") ? username : `@${username}`;
}

function getBlueskyUsername(url: string): string | undefined {
  if (!url) return undefined;
  const username = url.split("/").pop()?.replace(/^@/, "");
  return username ? `@${username}` : undefined;
}

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

const trimToLimit = (text: string, limit: number) =>
  text.length <= limit ? text : text.slice(0, limit - 1) + "…";

// ── tiers ──────────────────────────────────────────────────────────────────

const commercialTiers = [
  "Keystone",
  "Diamond",
  "Platinum",
  "Platinum X",
  "Gold",
  "Silver",
  "Bronze",
  "Patron",
] as const;

const isCommercialTier = (tier: any) => commercialTiers.includes(tier);

// ── message templates ──────────────────────────────────────────────────────

const charLimits: Record<string, number> = {
  instagram: 2200,
  x: 280,
  linkedin: 3000,
  bsky: 300,
  fosstodon: 500,
};

// Speaker messages
const speakerMessageTemplate = {
  instagram: ({ name, talkTitle }) =>
    `Join ${name} at EuroPython for "${talkTitle}".`,
  x: ({ name, handle, talkTitle, talkUrl }) =>
    handle
      ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}". Talk: ${talkUrl}`
      : `Join ${name} at EuroPython for "${talkTitle}". Talk: ${talkUrl}`,
  linkedin: ({ name, talkTitle }) =>
    `Join ${name} at EuroPython for "${talkTitle}".`,
  bsky: ({ name, handle, talkTitle, talkUrl }) =>
    handle
      ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}". Talk: ${talkUrl}`
      : `Join ${name} at EuroPython for "${talkTitle}". Talk: ${talkUrl}`,
  fosstodon: ({ name, handle, talkTitle, talkUrl }) =>
    handle
      ? `Join ${name} (${handle}) at EuroPython for "${talkTitle}". talk: ${talkUrl}`
      : `Join ${name} at EuroPython for "${talkTitle}". Talk: ${talkUrl}`,
};

// Sponsor messages
const commercialMessages = [
  "🎉✨ We are pleased to welcome SPONSOR_NAME as a sponsor for EuroPython 2026! Your support is making a huge difference. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
  "🚀✨ We are delighted to welcome SPONSOR_NAME as a sponsor for EuroPython 2026! Your support helps make this event extraordinary. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
  "🎉✨ A big thank you to SPONSOR_NAME for joining us as a sponsor for EuroPython 2026! Your support is making a huge impact. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
  "🚀✨ Big shoutout and heartfelt thanks to SPONSOR_NAME for sponsoring EuroPython 2026! Your support is crucial in bringing the European Python 🐍 community closer together. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌SPONSOR_HANDLE SPONSOR_URL",
  "🎉✨ Thank you to SPONSOR_NAME for sponsoring EuroPython 2026! Your support is making a huge difference. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
  "🚀✨ A huge thank you to SPONSOR_NAME for sponsoring EuroPython 2026! Your support helps make this event extraordinary. 🙌 SPONSOR_HANDLE SPONSOR_URL",
];

const communityMessages = [
  "🎉✨ A warm thank you to SPONSOR_NAME for supporting EuroPython 2026! We're proud to be a space where communities come together, and we value the opportunity to collaborate with other communities and open-source projects. 🙌 SUPPORTER_HANDLE SUPPORTER_URL",
];

const getRandomMessage = (messages: string[]) =>
  messages[Math.floor(Math.random() * messages.length)];

function buildSponsorMessage(
  template: string,
  name: string,
  handle: string,
  url: string
): string {
  return template
    .replace(/SPONSOR_NAME/g, name)
    .replace(/SPONSOR_HANDLE/g, handle)
    .replace(/SPONSOR_URL/g, url)
    .replace(/SUPPORTER_HANDLE/g, handle)
    .replace(/SUPPORTER_URL/g, url);
}

// ── main route ─────────────────────────────────────────────────────────────

export const GET: APIRoute = async () => {
  const allSpeakers = await getCollection("speakers");
  const allSessions = await getCollection("sessions");
  const allSponsors = await getCollection("sponsors");

  const excludeSponsors = ["startup"];

  // Derive keynote speaker IDs so we can skip them
  const keynoteSpeakerIds = new Set(
    allSessions
      .filter((s) => s.data.session_type?.toLowerCase() === "keynote")
      .flatMap((s) => s.data.speakers.map((ref) => ref.id))
  );

  // ── build speaker records ────────────────────────────────────────────────
  const speakerRecords: any[] = [];

  for (const speaker of allSpeakers) {
    if (keynoteSpeakerIds.has(speaker.id)) continue;

    const { name, twitter_url, linkedin_url, bluesky_url, mastodon_url, submissions } =
      speaker.data;

    const sessions = await Promise.all(
      submissions.map((s) => getEntry("sessions", s.id))
    );
    const validSessions = sessions.filter((s) => s && s.data.title);
    if (validSessions.length === 0) continue;

    const talkTitle = validSessions[0]?.data.title || "an exciting topic";
    const talkCode = validSessions[0]?.data.code;
    const talkUrl = `https://ep2026.europython.eu/${talkCode}`;
    const fallbackUrl = `https://ep2026.europython.eu/speaker/${speaker.id}`;
    const image = `https://ep2026.europython.eu/media/speakers/social-${speaker.id}.png`;

    const handles = {
      x: getTwitterUsername(twitter_url || ""),
      linkedin: getLinkedInUsernameHandler(linkedin_url || ""),
      bsky: getBlueskyUsername(bluesky_url || ""),
      fosstodon: getMastodonUsername(mastodon_url || ""),
    };

    const generateSpeakerMessage = (platform: keyof typeof speakerMessageTemplate) => {
      const fn = speakerMessageTemplate[platform];
      const handle = platform === "instagram" ? undefined : handles[platform as keyof typeof handles];
      const full = fn({ name, handle, talkTitle, talkUrl: platform === "instagram" ? fallbackUrl : talkUrl });
      return trimToLimit(full, charLimits[platform]);
    };

    speakerRecords.push({
      type: "speaker",
      name,
      image,
      handles,
      channel: {
        instagram: generateSpeakerMessage("instagram"),
        x: generateSpeakerMessage("x"),
        linkedin: generateSpeakerMessage("linkedin"),
        bsky: generateSpeakerMessage("bsky"),
        fosstodon: generateSpeakerMessage("fosstodon"),
      },
    });
  }

  // ── build sponsor records (commercial) ──────────────────────────────────
  const sponsorRecords: any[] = [];

  for (const sponsor of allSponsors) {
    if (excludeSponsors.includes(sponsor.id)) continue;
    if (!isCommercialTier(sponsor.data.tier)) continue;

    const { name, url, socials } = sponsor.data;
    const image = `https://ep2026.europython.eu/media/sponsors/social-${sponsor.id}.png`;

    const handles = {
      x: socials?.twitter || "",
      linkedin: socials?.linkedin || "",
      bsky: socials?.bluesky || "",
      fosstodon: socials?.mastodon || "",
    };

    const makeMsg = (platform: "x" | "linkedin" | "bsky" | "fosstodon") => {
      const messages = commercialMessages;
      const template = platform === "x" ? messages[0] : getRandomMessage(messages);
      const full = buildSponsorMessage(template, name, handles[platform], url);
      return trimToLimit(full, charLimits[platform]);
    };

    sponsorRecords.push({
      type: "sponsor",
      name,
      image,
      handles,
      channel: {
        x: makeMsg("x"),
        linkedin: makeMsg("linkedin"),
        bsky: makeMsg("bsky"),
        fosstodon: makeMsg("fosstodon"),
      },
    });
  }

  // ── build partner records (community) ────────────────────────────────────
  const partnerRecords: any[] = [];

  for (const sponsor of allSponsors) {
    if (excludeSponsors.includes(sponsor.id)) continue;
    if (isCommercialTier(sponsor.data.tier)) continue;

    const { name, url, socials } = sponsor.data;
    const image = `https://ep2026.europython.eu/media/sponsors/social-${sponsor.id}.png`;

    const handles = {
      x: socials?.twitter || "",
      linkedin: socials?.linkedin || "",
      bsky: socials?.bluesky || "",
      fosstodon: socials?.mastodon || "",
    };

    const makeMsg = (platform: "x" | "linkedin" | "bsky" | "fosstodon") => {
      const template = getRandomMessage(communityMessages);
      const full = buildSponsorMessage(template, name, handles[platform], url);
      return trimToLimit(full, charLimits[platform]);
    };

    partnerRecords.push({
      type: "partner",
      name,
      image,
      handles,
      channel: {
        x: makeMsg("x"),
        linkedin: makeMsg("linkedin"),
        bsky: makeMsg("bsky"),
        fosstodon: makeMsg("fosstodon"),
      },
    });
  }

  // ── interleave: speaker, speaker, sponsor, speaker, partner ──────────────
  // The pattern is a sequence of bucket references that repeats until all
  // buckets are exhausted; remaining items are appended at the end.
  const queue: any[] = [];
  const buckets = [speakerRecords, sponsorRecords, partnerRecords];
  const pattern = [0, 0, 1, 0, 2]; // indices into buckets[]
  const cursors = [0, 0, 0];

  while (true) {
    let added = 0;
    for (const b of pattern) {
      if (cursors[b] < buckets[b].length) {
        queue.push(buckets[b][cursors[b]++]);
        added++;
      }
    }
    if (added === 0) break; // all buckets exhausted
  }

  return new Response(JSON.stringify(queue, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
