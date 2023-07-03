import {
  fetchSpeakerBySlug,
  fetchSpeakersWithConfirmedSubmissions,
} from "@/lib/pretalx";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "components/definition-list/definition-list";
import { components } from "components/mdx";
import { Prose } from "components/prose/prose";
import { Title } from "components/typography/title";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const speaker = await fetchSpeakerBySlug(params.slug);

  if (!speaker) {
    throw notFound();
  }

  return {
    title: speaker.name,
  };
};

export async function generateStaticParams() {
  const speakers = await fetchSpeakersWithConfirmedSubmissions();

  return speakers.map((speaker) => ({
    slug: speaker.slug,
  }));
}

const getAvatarUrl = (avatar: string) => {
  if (avatar.startsWith("https://www.gravatar.com/avatar/")) {
    return `${avatar}?s=600`;
  }

  return avatar;
};

export default async function SpeakerPage({
  params,
}: {
  params: { slug: string };
}) {
  const speaker = await fetchSpeakerBySlug(params.slug);

  if (!speaker) {
    throw notFound();
  }

  const hasExtra = [
    speaker.company,
    speaker.homepage,
    speaker.github,
    speaker.linkedin,
  ].some((item) => !!item);

  return (
    <>
      <article className="accent-left">
        <Title>{speaker.name}</Title>

        {speaker.avatar && (
          <div>
            <img
              src={getAvatarUrl(speaker.avatar)}
              alt={speaker.name}
              className="w-full max-w-sm mb-12"
            />
          </div>
        )}

        <Title level={2}>Biography</Title>
        <Prose>
          {speaker.biography ? (
            <ReactMarkdown components={components}>
              {speaker.biography}
            </ReactMarkdown>
          ) : (
            <p>This person hasn't provided a biography</p>
          )}
        </Prose>

        {hasExtra ? (
          <>
            <Title level={2}>More about the speaker</Title>

            <DefinitionList>
              {speaker.company && (
                <>
                  <DefinitionTerm>Affiliation</DefinitionTerm>
                  <DefinitionDescription>
                    {speaker.company}
                  </DefinitionDescription>
                </>
              )}
              {speaker.homepage && (
                <>
                  <DefinitionTerm>Homepage</DefinitionTerm>
                  <DefinitionDescription>
                    <a
                      className="text-primary underline hover:text-primary-hover"
                      href={speaker.homepage}
                    >
                      {speaker.homepage}
                    </a>
                  </DefinitionDescription>
                </>
              )}
              {speaker.linkedin && (
                <>
                  <DefinitionTerm>Linkedin</DefinitionTerm>
                  <DefinitionDescription>
                    <a
                      href={speaker.linkedin}
                      className="text-primary underline hover:text-primary-hover"
                    >
                      {speaker.linkedin}
                    </a>
                  </DefinitionDescription>
                </>
              )}
              {speaker.github && (
                <>
                  <DefinitionTerm>GitHub</DefinitionTerm>
                  <DefinitionDescription>
                    <a
                      href={speaker.github}
                      className="text-primary underline hover:text-primary-hover"
                    >
                      {speaker.github}
                    </a>
                  </DefinitionDescription>
                </>
              )}
            </DefinitionList>
          </>
        ) : null}
      </article>
      <div className="h-12"></div>
    </>
  );
}
