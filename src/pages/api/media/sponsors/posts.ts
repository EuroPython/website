import { getCollection, getEntry } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const limit = Infinity;
  const sponsors = await getCollection("sponsors");
  const exclude = ["startup"];
  const records: any[] = [];

  const charLimits: Record<string, number> = {
    instagram: 2200,
    x: 280,
    linkedin: 3000,
    bsky: 300,
    fosstodon: 500,
  };

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

  const commercialMessages = [
    "🎉✨ We are pleased to welcome SPONSOR_NAME as a sponsor for EuroPython 2025! Your support is making a huge difference. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
    "🚀✨ We are delighted to welcome SPONSOR_NAME as a sponsor for EuroPython 2025! Your support helps make this event extraordinary. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
    "🎉✨ A big thank you to SPONSOR_NAME for joining us as a sponsor for EuroPython 2025! Your support is making a huge impact. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
    "🚀✨ Big shoutout and heartfelt thanks to SPONSOR_NAME for sponsoring EuroPython 2025! Your support is crucial in bringing the European Python 🐍 community closer together. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌SPONSOR_HANDLE SPONSOR_URL",
    "🎉✨ Thank you to SPONSOR_NAME for sponsoring EuroPython 2025! Your support is making a huge difference. We are so grateful for your sponsorship and are thrilled to have you with us. 🙌 SPONSOR_HANDLE SPONSOR_URL",
    "🚀✨ A huge thank you to SPONSOR_NAME for sponsoring EuroPython 2025! Your support helps make this event extraordinary. 🙌 SPONSOR_HANDLE SPONSOR_URL",
  ];

  const communityMessages = [
    "🎉✨ A warm thank you to SPONSOR_NAME for supporting EuroPython 2025! We're proud to be a space where communities come together, and we value the opportunity to collaborate with other communities and open-source projects. 🙌 SUPPORTER_HANDLE SUPPORTER_URL",
  ];

  const getRandomMessage = (messages: any) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const isCommercialTier = (tier: any) => {
    return tiers.includes(tier);
  };

  const message_template = {
    x: ({ name, handle, url, tier }) => {
      const isCommercial = isCommercialTier(tier);
      const messages = isCommercial ? commercialMessages : communityMessages;
      const template = messages[0];

      return template
        .replace(/SPONSOR_NAME/g, name)
        .replace(/SPONSOR_HANDLE/g, handle)
        .replace(/SPONSOR_URL/g, url)
        .replace(/SUPPORTER_HANDLE/g, handle)
        .replace(/SUPPORTER_URL/g, url);
    },
    linkedin: ({ name, handle, url, tier }) => {
      const isCommercial = isCommercialTier(tier);
      const messages = isCommercial ? commercialMessages : communityMessages;
      const template = getRandomMessage(messages);

      return template
        .replace(/SPONSOR_NAME/g, name)
        .replace(/SPONSOR_HANDLE/g, handle)
        .replace(/SPONSOR_URL/g, url)
        .replace(/SUPPORTER_HANDLE/g, handle)
        .replace(/SUPPORTER_URL/g, url);
    },
    bsky: ({ name, handle, url, tier }) => {
      const isCommercial = isCommercialTier(tier);
      const messages = isCommercial ? commercialMessages : communityMessages;
      const template = getRandomMessage(messages);

      return template
        .replace(/SPONSOR_NAME/g, name)
        .replace(/SPONSOR_HANDLE/g, handle)
        .replace(/SPONSOR_URL/g, url)
        .replace(/SUPPORTER_HANDLE/g, handle)
        .replace(/SUPPORTER_URL/g, url);
    },
    fosstodon: ({ name, handle, url, tier }) => {
      const isCommercial = isCommercialTier(tier);
      const messages = isCommercial ? commercialMessages : communityMessages;
      const template = getRandomMessage(messages);

      return template
        .replace(/SPONSOR_NAME/g, name)
        .replace(/SPONSOR_HANDLE/g, handle)
        .replace(/SPONSOR_URL/g, url)
        .replace(/SUPPORTER_HANDLE/g, handle)
        .replace(/SUPPORTER_URL/g, url);
    },
  };

  const trimToLimit = (text: string, limit: number) =>
    text.length <= limit ? text : text.slice(0, limit - 1) + "…";

  for (const sponsor of sponsors) {
    if (records.length >= limit) break;
    if (exclude.includes(sponsor.id)) continue;

    const { name, url, tier, socials } = sponsor.data;

    const sponsorImage = `https://ep2025.europython.eu/media/sponsors/social-${sponsor.id}.png`;

    const handles = {
      x: socials?.twitter,
      linkedin: socials?.linkedin,
      bsky: socials?.bluesky,
      fosstodon: socials?.mastodon,
    };

    const generateMessage = (platform: keyof typeof message_template) => {
      const templateFn = message_template[platform];
      const handle = handles[platform as keyof typeof handles] || "";

      const full = templateFn({
        name,
        handle,
        url,
        tier,
      });

      const limit = charLimits[platform];
      return trimToLimit(full, limit);
    };

    const record = {
      name,
      image: sponsorImage,
      handles: handles,
      channel: {
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
