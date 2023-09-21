import live from "../../../../data/live.json";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import { SelectRoom } from "./select-room";
import { Metadata } from "next";
import { YoutubeVideo } from "./youtube-video";
import { Link } from "components/link/link";

export const generateMetadata = async ({
  params,
}: {
  params: { room: string };
}): Promise<Metadata> => {
  const room = live.rooms.find((room) => room.slug === params.room);

  if (!room) {
    throw notFound();
  }

  const metadata: Metadata = {
    title: `🔴 ${room.name} - Live`,
    description: `Livestream for ${room.name}`,
    twitter: {
      card: "summary_large_image",
      title: `🔴 ${room.name} - Live`,
      description: `Livestream for ${room.name}`,
    },
  };

  return metadata;
};

export default function LivePage({ params }: { params: { room: string } }) {
  const room = live.rooms.find((room) => room.slug === params.room);

  if (!room) {
    throw notFound();
  }

  return (
    <>
      <Title>{room.name}</Title>

      <YoutubeVideo youtubeId={room.youtubeId} />

      <div className="h-12" />

      <Title>Change room:</Title>
      <SelectRoom room={room} rooms={live.rooms} />

      <div className="h-12" />

      <Title>
        <Link href="https://www.youtube.com/playlist?list=PL8uoeex94UhFcwvAfWHybD7SfNgIUBRo-">
          Edited video playlist 📼
        </Link>
      </Title>

      <Title>
        <Link href="https://www.youtube.com/playlist?list=PL8uoeex94UhEGxPOetT3bpg8ibcxflh44">
          Livestream playlist 📼
        </Link>
      </Title>

      <div className="h-12" />
    </>
  );
}
