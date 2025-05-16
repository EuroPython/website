import { getCollection, getEntry } from "astro:content";
export async function GET() {
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

  const exclude = [
    "sebastian-ramirez",
    "savannah-ostrowski",
    "nerea-luis",
    "petr-baudis",
    "brett-cannon",
  ];

  const rows: string[][] = [];

  for (const speaker of speakers) {
    if (exclude.includes(speaker.id)) continue;

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

    for (const session of sessions) {
      if (session) {
        const speaker_page = `https://ep2025.europython.eu/speaker/${speaker.id}`;
        rows.push([
          session.data.title || "",
          name,
          `https://ep2025-buffer.ep-preview.click/media/social-${speaker.id}.png`,
          twitter_url || linkedin_url || mastodon_url || speaker_page,
          twitter_url ?? speaker_page,
          linkedin_url ?? speaker_page,
          bluesky_url ?? speaker_page,
          mastodon_url ?? speaker_page,
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
