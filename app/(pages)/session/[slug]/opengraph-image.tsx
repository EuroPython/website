import { ImageResponse } from "next/server";
import { OpenGraphImageSession } from "components/opengraph-image/opengraph-image-session";
import { fetchSubmissionBySlug } from "@/lib/pretalx/submissions";

export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const session = await fetchSubmissionBySlug(params.slug);

  if (!session) {
    throw new Error("Session not found");
  }

  return new ImageResponse(
    (
      <OpenGraphImageSession
        title={session.title}
        speakers={session.speakers.map((x) => x.name)}
      />
    )
  );
}
