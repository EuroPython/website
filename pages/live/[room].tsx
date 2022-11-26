import { Select } from "components/form/select";
import { Title } from "components/typography/title";
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
      <main id="main-content" className="px-6">
        <Title highlighted>{room.name}</Title>

        <iframe
          id="ytplayer"
          className="aspect-video border-none w-full mb-12"
          src={`https://www.youtube.com/embed/${room.youtubeId}?autoplay=1&amp;origin=https://ep2022.europython.eu`}
        ></iframe>

        <Title level={2}>Change room:</Title>

        <Select
          name="schedule-select"
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
        </Select>
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
