import { fetchKeynoteBySpeakerSlug } from "@/lib/pretix/submissions";
import { OpenGraphImageKeynoter } from "components/opengraph-image/opengraph-image-keynoter";
import { ImageResponse } from "next/server";

export const size = { width: 1200, height: 600 };
export const alt = "...";
export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);
  const keynoter = session?.speakers[0]!;

  return new ImageResponse(
    (
      <OpenGraphImageKeynoter
        name={keynoter.name}
        avatar={keynoter.avatar}
        tagline={session?.tagline || ""}
      />
    )
  );
}
