import { experimental_AstroContainer } from "astro/container";
import YouTube from "@ui/YouTube.astro";

export async function replaceYouTubeLinks(
  markdownContent: string
): Promise<string> {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s'"()[\]<>]+)/gi;

  const matches = [...markdownContent.matchAll(youtubeRegex)];
  if (matches.length === 0) return markdownContent;

  const container = await experimental_AstroContainer.create();
  let updatedContent = markdownContent;

  for (const match of matches) {
    const fullUrl = match[0];
    const id = match[1];

    if (!id) continue;

    const html = await container.renderToString(YouTube, {
      props: { id, alt: "Embedded YouTube video" },
    });

    updatedContent = updatedContent.replace(fullUrl, html);
  }

  return updatedContent;
}
