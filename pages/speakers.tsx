import { Layout } from "../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSpeakers } from "../lib/speakers";
import { Fragment } from "react";

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
      <main id="main-content">
        <h1>Speakers</h1>

        <div className="speakers-letters">
          {Object.keys(groups).map((letter) => (
            <h3 key={letter}>
              <a href={`#letter-${letter}`}>{letter}</a>
            </h3>
          ))}
        </div>

        {Object.entries(groups).map(([letter, speakers], index) => (
          <Fragment key={letter}>
            <div id={`letter-${letter}`}>
              <h2>{letter}</h2>
              <ul className="all-speakers-list">
                {speakers.map((speaker) => (
                  <li key={speaker.code}>
                    <a href={`/speaker/${speaker.slug}`}>{speaker.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {index !== Object.keys(groups).length - 1 && <hr />}
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
