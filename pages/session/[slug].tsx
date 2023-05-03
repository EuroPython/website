import { MDXRemote } from "next-mdx-remote";
import { Layout } from "../../components/layout";
import { fetchSessions } from "../../lib/sessions";
import parseISO from "date-fns/parseISO";
import { format } from "date-fns";
import { Datetime } from "../../components/datetime";
import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { Tag, TagContainer } from "components/tag/tag";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "components/definition-list/definition-list";
import { serialize } from "lib/mdx-utils";

// TODO: move to /app
type Speaker = {
  code: string;
  name: string;
  avatar: string;
  slug: string;
  biography: string;
  biographySource: any;
};

type Session = {
  code: string;
  title: string;
  slug: string;
  abstract: string;
  type: string;
  room: string;
  abstractSource: any;
  duration: number;
  start: string;
  description: string;
  descriptionSource: any;
  track: string;
  slidesUrl?: string;
  speakers: Speaker[];
};

export default function Page({
  path,
  session,
  sessionsInParallel,
  sessionsAfter,
}: {
  path: string;
  session: Session;
  sessionsAfter: Session[];
  sessionsInParallel: Session[];
}) {
  const socialCardUrl = `https://ep2022.europython.eu/api/social-cards/?session=${session.code}`;
  const speakers = session.speakers.map((speaker) => speaker.name).join(", ");
  const title = `${session.title} - ${speakers} - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote`;

  const start = session.start ? parseISO(session.start) : null;

  return (
    <Layout path={path} socialCardUrl={socialCardUrl} title={title}>
      <main id="main-content" className="px-6 pt-12">
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
            <MDXRemote {...session.abstractSource} />
          </Prose>

          <TagContainer className="mb-6">
            <Tag>{session.type}</Tag>
            <Tag>{session.track}</Tag>
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
                <MDXRemote {...session.descriptionSource} />
              </Prose>
            </>
          ) : (
            ""
          )}
        </article>

        <Separator />

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
                <MDXRemote {...speaker.biographySource} />
              </Prose>
            </div>
          ))}
        </article>

        <Separator />

        <section className="grid gap-6 md:grid-cols-2 accent-right">
          {sessionsInParallel.length ? (
            <aside>
              <Title level={4}>Sessions at the same time</Title>
              <ul className="space-y-4">
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
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const sessions = await fetchSessions();

  return {
    paths: sessions.map((session: { slug: string }) => ({
      params: {
        slug: session.slug,
      },
    })),
    fallback: "blocking",
  };
}

const getSession = (slug: string, sessions: any) => {
  const session = sessions.find(
    (session: { slug: string; code: string }) =>
      session.slug === slug || session.code === slug
  );

  return session;
};

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const sessions = await fetchSessions();

  const session = getSession(params.slug, sessions);

  if (!session) {
    return {
      notFound: true,
    };
  }

  const abstractSource = await serialize(session.abstract, {});
  const descriptionSource = await serialize(session.description, {});

  const speakers = await Promise.all(
    session.speakers.map(async (speaker: Speaker) => {
      const biographySource = await serialize(speaker.biography, {});
      return {
        ...speaker,
        biographySource,
      };
    })
  );

  const sessionsAfter = (session.talks_after || [])
    .map((code: string) => getSession(code, sessions) || null)
    .filter((s: any) => s !== null);

  const sessionsInParallel = (session.talks_in_parallel || [])
    .map((code: string) => getSession(code, sessions) || null)
    .filter((s: any) => s !== null);

  return {
    props: {
      path: `/session/${params.slug}`,
      session: {
        ...session,
        type: session.submission_type,
        abstractSource,
        descriptionSource,
        speakers,
      },
      sessionsAfter,
      sessionsInParallel,
    },
    revalidate: 60,
  };
}
