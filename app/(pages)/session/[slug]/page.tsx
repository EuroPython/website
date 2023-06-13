import { format } from "date-fns";
import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { Tag, TagContainer } from "components/tag/tag";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "components/definition-list/definition-list";
import { fetchSubmissionBySlug } from "@/lib/pretix/submissions";
import { notFound } from "next/navigation";
import { Datetime } from "components/datetime";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { components } from "components/mdx";

import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const session = await fetchSubmissionBySlug(params.slug);

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

export default async function SessionPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await fetchSubmissionBySlug(params.slug);

  if (!session) {
    throw notFound();
  }

  // TODO: social card
  //   const socialCardUrl = `https://ep2022.europython.eu/api/social-cards/?session=${session.code}`;
  const speakers = session.speakers.map((speaker) => speaker.name).join(", ");
  // TODO: once we have the start date and time
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
      </article>

      <Separator />

      {session.speakers.length > 0 ? (
        <>
          <article className="accent-left">
            <Title level={2}>
              The speaker{session.speakers.length > 1 ? "s" : ""}
            </Title>

            {session.speakers.map((speaker) => (
              <div key={speaker.code} className="mb-4">
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
            ))}
          </article>

          <Separator />
        </>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 accent-right">
        {sessionsInParallel.length ? (
          <aside>
            <Title level={4}>Sessions at the same time</Title>
            <ul className="space-y-4">
              {/* @ts-ignore */}
              {sessionsInParallel.map((s) => (
                <li key={s.slug}>
                  <a
                    className="underline hover:text-primary-hover"
                    href={`/session/${s.slug}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
        {sessionsAfter.length ? (
          <aside>
            <Title level={4}>After this session</Title>
            <ul className="space-y-4">
              {/* @ts-ignore */}
              {sessionsAfter.map((s) => (
                <li key={s.slug}>
                  <a
                    className="underline hover:text-primary-hover"
                    href={`/session/${s.slug}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </section>

      {start ? (
        <>
          <Separator />

          <a
            className="block text-6xl font-bold text-center hover:text-primary-hover mt-24 mb-12"
            href={`/schedule/${format(start, "yyyy-MM-dd")}#${session.code}`}
          >
            ← Back to schedule
          </a>
        </>
      ) : null}
    </>
  );
}
