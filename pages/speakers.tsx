import { Layout } from "../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSpeakers } from "../lib/speakers";
import { Fragment } from "react";
import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";

type Speaker = {
  code: string;
  name: string;
  biography: string;
  avatar: string | null;
  slug: string;
  affiliation: string;
  homepage: string | null;
  twitter: string | null;
};

export default function SpeakersPage({ speakers }: { speakers: Speaker[] }) {
  // group speakers by starting letter
  const groups = speakers
    .filter((speaker) => !!speaker.name)
    .reduce((acc, speaker) => {
      const letter = speaker.name[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(speaker);
      return acc;
    }, {} as { [key: string]: Speaker[] });

  return (
    <Layout title="Speakers - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote">
      <main id="main-content" className="px-6">
        <Title>Speakers</Title>

        <div className="flex text-3xl font-bold flex-wrap">
          {Object.keys(groups).map((letter) => (
            <Title level={3} key={letter} className="mr-2">
              <a href={`#letter-${letter}`}>{letter}</a>
            </Title>
          ))}
        </div>

        {Object.entries(groups).map(([letter, speakers], index) => (
          <Fragment key={letter}>
            <div id={`letter-${letter}`}>
              <Title level={2}>{letter}</Title>

              <ul className="list-disc pl-4">
                {speakers.map((speaker) => (
                  <li key={speaker.code} className="mb-1">
                    <a className="underline hover:text-primary-hover" href={`/speaker/${speaker.slug}`}>{speaker.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {index !== Object.keys(groups).length - 1 && <Separator />}
          </Fragment>
        ))}
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const uniq = (speakers: Speaker[]) => {
    const seen: { [key: string]: boolean } = {};

    return speakers.filter((item) =>
      seen.hasOwnProperty(item.slug) ? false : (seen[item.slug] = true)
    );
  };

  const speakers = uniq(await fetchSpeakers()).sort((a: Speaker, b: Speaker) =>
    a.name.localeCompare(b.name)
  );

  return {
    props: {
      speakers,
    },
    revalidate: 60,
  };
}
