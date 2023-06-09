import { getImage } from "../get-image";
import { getPage } from "../get-page";

export const size = { width: 1200, height: 600 };
export const alt = "...";
export const contentType = "image/png";

export default async function og({
  params,
}: {
  params: { slug: string; secondLevel: string };
}) {
  const page = await getPage([params.slug, params.secondLevel], false);

  // @ts-ignore
  return getImage({ page });
}
