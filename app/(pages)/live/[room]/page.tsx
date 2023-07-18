import { Title } from "components/typography/title";
// import { notFound } from "next/navigation";
// import { SelectRoom } from "./select-room";
// import { Metadata } from "next";
// import { YoutubeVideo } from "./youtube-video";

const live = {
  rooms: [
    {
      name: "Forum",
      slug: "forum",
      youtubeId: "HHvm_TYhG14",
    },
    {
      name: "North Hall",
      slug: "north-hall",
      youtubeId: "yQ09oXwBaUY",
    },
    {
      name: "Terrace 2A",
      slug: "terrace-2a",
      youtubeId: "epINsTnV1Kw",
    },
    {
      name: "Terrace 2B",
      slug: "terrace-2b",
      youtubeId: "5JuNAvheGvU",
    },
    {
      name: "South Hall 2A",
      slug: "south-hall-2a",
      youtubeId: "E8KZF8PAwME",
    },
    {
      name: "South Hall 2B",
      slug: "south-hall-2b",
      youtubeId: "WuLqtlDXqLQ",
    },
  ],
};

// export const generateMetadata = async ({
//   params,
// }: {
//   params: { room: string };
// }): Promise<Metadata> => {
//   const room = live.rooms.find((room) => room.slug === params.room);

//   if (!room) {
//     throw notFound();
//   }

//   const metadata: Metadata = {
//     title: `🔴 ${room.name} - Live`,
//     description: `Livestream for ${room.name}`,
//     twitter: {
//       card: "summary_large_image",
//       title: `🔴 ${room.name} - Live`,
//       description: `Livestream for ${room.name}`,
//     },
//   };

//   return metadata;
// };

export default function LivePage({ params }: { params: { room: string } }) {
  const room = live.rooms.find((room) => room.slug === params.room);

  if (!room) {
    return "Room not found"
  }

  return (
    <>
      <Title>{room.name}</Title>

      {/* <YoutubeVideo youtubeId={room.youtubeId} /> */}

      <div className="h-12" />

      <Title>Change room:</Title>
      {/* <SelectRoom room={room} rooms={live.rooms} /> */}

      <div className="h-12" />
    </>
  );
}
