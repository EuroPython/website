import { ImageResponse } from "next/server";
import { OpenGraphImage } from "components/opengraph-image/opengraph-image";
import { fetchSubmissionBySlug } from "@/lib/pretix/submissions";

export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const session = await fetchSubmissionBySlug(params.slug);

  if (!session) {
    throw new Error("Session not found");
  }

  const title = session.title;
  // abstract might be too long
  const description = "";

  return new ImageResponse(
    <OpenGraphImage title={title} description={description} />
  );
}
