import { getCollection, getEntry } from "astro:content";
export async function GET({ params, request }) {
  const speakers = await getCollection("speakers");

  const header = [
    "Talk Title",
    "Speaker Name",
    "Speaker Photo URL",
    "Primary Social ULR",
    "X URL",
    "LinkedIn URL",
    "Bluesky URL",
    "Mastodon URL",
  ];

  const rows: string[][] = [];

  for (const speaker of speakers) {
    const {
      name,
      avatar,
      homepage,
      gitx_url,
      twitter_url,
      linkedin_url,
      bluesky_url,
      mastodon_url,
      submissions,
    } = speaker.data;

    const sessions = await Promise.all(
      submissions.map((session) => getEntry("sessions", session.id))
    );

    for (const session of sessions) {
      if (session) {
        rows.push([
          session.data.title || "",
          name,
          `https://ep2025-buffer.ep-preview.click/media/social-${speaker.id}.png`,
          twitter_url ||
            linkedin_url ||
            mastodon_url ||
            gitx_url ||
            homepage ||
            `https://ep2025.europython.eu/speaker/${speaker.id}`,
          twitter_url ?? "",
          linkedin_url ?? "",
          bluesky_url ?? "",
          mastodon_url ?? "",
        ]);
      }
    }
  }

  const csvLines = [header, ...rows]
    .map((row) =>
      row
        .map((field) =>
          field.includes('"') || field.includes(",") || field.includes("\n")
            ? `"${field.replace(/"/g, '""')}"`
            : field
        )
        .join(",")
    )
    .join("\r\n");

  return new Response(csvLines, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="social_media.csv"',
    },
  });
}
