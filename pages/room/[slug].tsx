import { Layout } from "../../components/layout";
import Image from "next/image";
import rooms from "../../data/rooms.json";
import { Title } from "components/typography/title";

export default function RoomPage({
  room,
  path,
}: {
  path: string;
  room: {
    name: string;
    slug: string;
    floor: string;
    factSheet: string;
    image: {
      path: string;
      width: number;
      height: number;
    } | null;
  };
}) {
  return (
    <Layout
      title={`Room ${room.name} - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote`}
      path={path}
    >
      <main id="main-content" className="px-6">
        <Title className="!mb-2">{room.name}</Title>
        <p className="font-bold">Level: {room.floor}</p>

        <a className="underline text-primary" href={room.factSheet}>
          Fact sheet
        </a>

        {room.image ? (
          <div className="mt-4">
            <Image
              src={room.image.path}
              width={room.image.width}
              height={room.image.height}
              layout="responsive"
            />
          </div>
        ) : null}
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = rooms.map((room) => ({
    params: { slug: room.slug },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const pagePath = `room/${params.slug}`;

  return {
    props: {
      path: pagePath,
      room: rooms.find((room) => room.slug === params.slug),
    },
    revalidate: 60,
  };
}
