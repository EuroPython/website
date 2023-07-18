import live from "../../../../data/live.json";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import { SelectRoom } from "./select-room";
import { Metadata } from "next";

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

      <iframe
        id="ytplayer"
        className="w-full h-full aspect-[16/9]"
        width="640"
        height="360"
        src={`https://www.youtube.com/embed/${room.youtubeId}?autoplay=1&amp;origin=https://ep2023.europython.eu`}
      ></iframe>

      <div className="h-12" />

      <Title>Change room:</Title>
      <SelectRoom room={room} rooms={live.rooms} />

      <div className="h-12" />
    </>
  );
}
