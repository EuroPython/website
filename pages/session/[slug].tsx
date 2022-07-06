import { MDXRemote } from "next-mdx-remote";
import { Layout } from "../../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSessions } from "../../lib/sessions";
import parseISO from "date-fns/parseISO";
import { format } from "date-fns";
import { Datetime } from "../../components/datetime";

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
      <main id="main-content" className="session">
        <article className="accent-left">
          <h1>{session.title}</h1>
          <dl>
            {session.room ? (
              <>
                <dt>Room:</dt>
                <dd>{session.room}</dd>
              </>
            ) : null}
            {start ? (
              <>
                <dt>Start (Dublin time):</dt>
                <dd>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={false}
                  />
                </dd>
                <dt>Start (your time):</dt>
                <dd>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={true}
                  />
                </dd>
              </>
            ) : null}
            <dt>Duration:</dt>
            <dd>{session.duration} minutes</dd>
          </dl>
          <h2>Abstract</h2>
          <MDXRemote {...session.abstractSource} />
          <p>
            <span className="tag">{session.type}</span>
            <span className="tag">{session.track}</span>
          </p>
          {session.slidesUrl && (
            <a href={session.slidesUrl} className="button">
              Download slides
            </a>
          )}
          {session.description ? (
            <>
              <h2>Description</h2>
              <MDXRemote {...session.descriptionSource} />
            </>
          ) : (
            ""
          )}
        </article>

        <hr />

        <article className="accent-left">
          <h2 className="h5">
            The speaker{session.speakers.length > 1 ? "s" : ""}
          </h2>

          {session.speakers.map((speaker) => (
            <div key={speaker.code}>
              <p className="large">
                <a href={`/speaker/${speaker.slug}`}>{speaker.name}</a>
              </p>
              <MDXRemote {...speaker.biographySource} />
            </div>
          ))}
        </article>

        <hr />

        <section className="cards accent-right">
          {sessionsInParallel.length ? (
            <aside>
              <h3>Sessions at the same time</h3>
              <ul className="unstyled-list links">
                {sessionsInParallel.map((s) => (
                  <li key={s.slug}>
                    <a href={`/session/${s.slug}`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
          {sessionsAfter.length ? (
            <aside>
              <h3>After this session</h3>
              <ul className="unstyled-list links">
                {sessionsAfter.map((s) => (
                  <li key={s.slug}>
                    <a href={`/session/${s.slug}`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </section>

        {start ? (
          <>
            <hr />

            <section className="cards">
              <a
                className="h2"
                href={`/schedule/${format(start, "yyyy-MM-dd")}`}
              >
                ← Back to schedule
              </a>
            </section>
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
