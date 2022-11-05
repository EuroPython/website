import { MDXRemote } from "next-mdx-remote";
import { Layout } from "../../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSpeakers } from "../../lib/speakers";

type Speaker = {
  code: string;
  name: string;
  biography: string;
  avatar: string | null;
  slug: string;
  affiliation: string;
  homepage: string | null;
  twitter: string | null;
  bioSource: any;
};

const getAvatarUrl = (avatar: string) => {
  if (avatar.startsWith("https://www.gravatar.com/avatar/")) {
    return `${avatar}?s=600`;
  }

  return avatar;
};

export default function Page({
  path,
  speaker,
}: {
  path: string;
  speaker: Speaker;
}) {
  const title = `${speaker.name} - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote`;
  const hasExtra = speaker.affiliation || speaker.homepage || speaker.twitter;
  if (speaker.homepage != null) {
     speaker.homepage = (speaker.homepage.indexOf('://') === -1) ? 'https://' + speaker.homepage : speaker.homepage;
  }

  return (
    <Layout path={path} title={title}>
      <main id="main-content" className="session">
        <article className="accent-left">
          <h1>{speaker.name}</h1>

          {speaker.avatar && (
            <div className="speaker-avatar">
              <img src={getAvatarUrl(speaker.avatar)} alt={speaker.name} />
            </div>
          )}

          <h2>Biography</h2>
          {speaker.bioSource ? (
            <MDXRemote {...speaker.bioSource} />
          ) : (
            <p>This person hasn't provided a biography</p>
          )}

          {hasExtra ? (
            <>
              <h2>More about the speaker</h2>

              <dl>
                {speaker.affiliation && (
                  <>
                    <dt>Affiliation</dt>
                    <dd>{speaker.affiliation}</dd>
                  </>
                )}
                {speaker.homepage && (
                  <>
                    <dt>Homepage</dt>
                    <dd>
                      <a href={speaker.homepage}>{speaker.homepage}</a>
                    </dd>
                  </>
                )}
                {speaker.twitter && (
                  <>
                    <dt>Twitter</dt>
                    <dd>
                      <a href={`https://twitter.com/${speaker.twitter}`}>
                        {speaker.twitter}
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            </>
          ) : null}
        </article>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const speakers = await fetchSpeakers();

  return {
    paths: speakers
      .filter((speaker: { name: string }) => !!speaker.name)
      .map((speaker: { slug: string }) => ({
        params: {
          slug: speaker.slug,
        },
      })),
    fallback: "blocking",
  };
}

const getSpeaker = (slug: string, speakers: any) => {
  const speaker = speakers.find(
    (speaker: { slug: string; code: string }) => speaker.slug === slug
  );

  return speaker;
};

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const speakers = await fetchSpeakers();
  const speaker = getSpeaker(params.slug, speakers);
  const bioSource = speaker.biography
    ? await serialize(speaker.biography, {})
    : null;

  return {
    props: {
      path: `/speaker/${params.slug}`,
      speaker: {
        ...speaker,
        bioSource,
      },
    },
    revalidate: 60,
  };
}
