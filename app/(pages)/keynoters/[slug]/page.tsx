import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { Tag, TagContainer } from "components/tag/tag";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "components/definition-list/definition-list";
import { fetchKeynoteBySpeakerSlug } from "@/lib/pretix/submissions";
import { notFound } from "next/navigation";
import { Datetime } from "components/datetime";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { components } from "components/mdx";

import { Metadata } from "next";

export const revalidate = 300; // 5 minutes

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);

  if (!session) {
    throw notFound();
  }

  const metadata: Metadata = {
    title: session.title,
    description: session.abstract,
    twitter: {
      card: "summary_large_image",
      title: session.title,
      description: session.abstract,
    },
  };

  return metadata;
};

// export async function generateStaticParams() {
//   const submissions = await fetchConfirmedSubmissions();

//   return submissions.map((submission) => ({
//     slug: submission.slug,
//   }));
// }

// TODO: remove code duplication

const getAvatarUrl = (avatar: string) => {
  if (avatar.startsWith("https://www.gravatar.com/avatar/")) {
    return `${avatar}?s=600`;
  }

  return avatar;
};
export default async function SessionPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await fetchKeynoteBySpeakerSlug(params.slug);

  if (!session) {
    throw notFound();
  }

  const start = null;

  // @ts-ignore
  const sessionsAfter = [];
  // @ts-ignore
  const sessionsInParallel = [];

  return (
    <>
      <article className="accent-left">
        <header className="mb-6">
          <Title level={2}>{session.title}</Title>
          <DefinitionList>
            {session.room ? (
              <>
                <DefinitionTerm>Room:</DefinitionTerm>
                <DefinitionDescription>{session.room}</DefinitionDescription>
              </>
            ) : null}
            {start ? (
              <>
                <DefinitionTerm>Start (Dublin time):</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={false}
                  />
                </DefinitionDescription>
                <DefinitionTerm>Start (your time):</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={true}
                  />
                </DefinitionDescription>
              </>
            ) : null}
            <DefinitionTerm>Duration:</DefinitionTerm>
            <DefinitionDescription>
              {session.duration} minutes
            </DefinitionDescription>
          </DefinitionList>
        </header>

        {session.abstract ? (
          <>
            <Title level={2} className="!mb-6">
              Abstract
            </Title>

            <Prose>
              <ReactMarkdown components={components}>
                {session.abstract}
              </ReactMarkdown>
            </Prose>

            <TagContainer className="mb-6">
              <Tag>{session.type}</Tag>
              {session.track && <Tag>{session.track}</Tag>}
            </TagContainer>

            {session.slidesUrl && (
              <a href={session.slidesUrl} className="button">
                Download slides
              </a>
            )}
            {session.description ? (
              <>
                <Title level={2} className="!mb-6">
                  Description
                </Title>

                <Prose>
                  <ReactMarkdown components={components}>
                    {session.description}
                  </ReactMarkdown>
                </Prose>
              </>
            ) : (
              ""
            )}
          </>
        ) : null}
      </article>

      <Separator />

      <article className="accent-left">
        <Title level={2}>
          The speaker{session.speakers.length > 1 ? "s" : ""}
        </Title>

        {session.speakers.map((speaker) => (
          <div
            key={speaker.code}
            className="mb-4 md:grid grid-cols-[260px_1fr] md:gap-6"
          >
            <div className="flex items-start mb-4">
              <img
                src={getAvatarUrl(speaker.avatar)}
                alt={speaker.name}
                className="w-full max-w-sm mb-12"
              />
            </div>

            <div>
              <p className="mb-4">
                <a
                  href={`/speaker/${speaker.slug}`}
                  className="text-4xl hover:text-primary-hover underline font-bold"
                >
                  {speaker.name}
                </a>
              </p>
              <Prose>
                <ReactMarkdown components={components}>
                  {speaker.bio}
                </ReactMarkdown>
              </Prose>
            </div>
          </div>
        ))}
      </article>
      <div className="h-12"></div>
    </>
  );
}
