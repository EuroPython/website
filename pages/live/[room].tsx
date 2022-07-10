import { useCallback } from "react";
import { Layout } from "../../components/layout";
import live from "../../data/live.json";

export default function LivePage({
  room,
}: {
  room: {
    name: string;
    slug: string;
    youtubeId: string;
  };
}) {
  const handleRoomSelected = useCallback((event) => {
    window.location.href = `/live/${event.target.value}`;
  }, []);

  return (
    <Layout>
      <main id="main-content">
        <h1 className="highlighted">{room.name}</h1>

        <iframe
          id="ytplayer"
          style={{
            aspectRatio: "16/9",
            border: 0,
          }}
          width="640"
          height="360"
          src={`https://www.youtube.com/embed/${room.youtubeId}?autoplay=1&amp;origin=https://ep2022.europython.eu`}
        ></iframe>

        <h1>Change room:</h1>

        <select
          id="schedule-select"
          className="select--schedule"
          onChange={handleRoomSelected}
          defaultValue={room.slug}
        >
          {live.rooms.map(({ slug, name }) => {
            return (
              <option key={slug} value={slug}>
                {name}
              </option>
            );
          })}
        </select>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = live.rooms.map((room) => ({
    params: { room: room.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { room: string } }) {
  const room = live.rooms.find((room) => room.slug === params.room);

  return {
    props: { room },
    revalidate: 60,
  };
}
