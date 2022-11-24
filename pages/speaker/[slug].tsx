import { MDXRemote } from "next-mdx-remote";
import { Layout } from "../../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSpeakers } from "../../lib/speakers";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import {
  DefinitionDescription,
  DefinitionList,
  DefinitionTerm,
} from "components/definition-list/definition-list";

type Speaker = {
  code: string;
  name: string;
  biography: string;
  avatar: string | null;
  slug: string;
  affiliation: string;
  homepage: string | null;
  homepageUrl: string | null;
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
    speaker.homepageUrl =
      speaker.homepage.indexOf("://") === -1
        ? "https://" + speaker.homepage
        : speaker.homepage;
  }

  return (
    <Layout path={path} title={title}>
      <main id="main-content" className="px-6">
        <article className="accent-left">
          <Title>{speaker.name}</Title>

          {speaker.avatar && (
            <div className="w-full max-w-sm mb-12">
              <img src={getAvatarUrl(speaker.avatar)} alt={speaker.name} />
            </div>
          )}

          <Title level={2}>Biography</Title>
          <Prose>
            {speaker.bioSource ? (
              <MDXRemote {...speaker.bioSource} />
            ) : (
              <p>This person hasn't provided a biography</p>
            )}
          </Prose>

          {hasExtra ? (
            <>
              <Title level={2}>More about the speaker</Title>

              <DefinitionList>
                {speaker.affiliation && (
                  <>
                    <DefinitionTerm>Affiliation</DefinitionTerm>
                    <DefinitionDescription>
                      {speaker.affiliation}
                    </DefinitionDescription>
                  </>
                )}
                {speaker.homepageUrl && (
                  <>
                    <DefinitionTerm>Homepage</DefinitionTerm>
                    <DefinitionDescription>
                      <a
                        className="text-primary underline hover:text-primary-hover"
                        href={speaker.homepageUrl}
                      >
                        {speaker.homepage}
                      </a>
                    </DefinitionDescription>
                  </>
                )}
                {speaker.twitter && (
                  <>
                    <DefinitionTerm>Twitter</DefinitionTerm>
                    <DefinitionDescription>
                      <a
                        href={`https://twitter.com/${speaker.twitter}`}
                        className="text-primary underline hover:text-primary-hover"
                      >
                        {speaker.twitter}
                      </a>
                    </DefinitionDescription>
                  </>
                )}
              </DefinitionList>
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
