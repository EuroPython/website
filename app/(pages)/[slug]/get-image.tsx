import path from "path";
import { ImageResponse } from "next/server";
import { promises as fs } from "fs";
import { OpenGraphImage } from "components/opengraph-image/opengraph-image";

export const getImage = async ({
  page,
}: {
  page: {
    data: {
      social_card?: string;
      title: string;
      subtitle: string;
    };
  };
}) => {
  if (page.data.social_card) {
    // read image and return it

    const image = await fs.readFile(
      // images are in the public folder at the root of the project
      path.join(process.cwd(), "social-cards", page.data.social_card)
    );

    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }

  const title = page.data.title;
  const description = page.data.subtitle || "";

  return new ImageResponse(
    <OpenGraphImage title={title} description={description} />
  );
};
