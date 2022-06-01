import { MDXRemote } from "next-mdx-remote";
import { Layout } from "../../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { fetchSessions } from "../../lib/sessions";

type Speaker = {
  code: string;
  name: string;
  avatar: string;
  biography: string;
  biographySource: any;
};

type Session = {
  code: string;
  title: string;
  slug: string;
  abstract: string;
  type: string;
  abstractSource: any;
  description: string;
  descriptionSource: any;
  track: string;
  slidesUrl?: string;
  speakers: Speaker[];
};

export default function Page({
  path,
  session,
}: {
  path: string;
  session: Session;
}) {
  const socialCardUrl = `https://ep2022.europython.eu/api/social-cards/?session=${session.code}`;
  const speakers = session.speakers.map((speaker) => speaker.name).join(", ");
  const title = `${session.title} - ${speakers} - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote`;

  return (
    <Layout path={path} socialCardUrl={socialCardUrl} title={title}>
      <main id="main-content">
        <article className="accent-left">
          <h1>{session.title}</h1>
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
            <div>
              <p className="large">{speaker.name}</p>
              <MDXRemote {...speaker.biographySource} />
            </div>
          ))}
        </article>

        <hr />

        {/* <section className="cards accent-right">
          <aside>
            <h3>Sessions at the same time</h3>
            <ul className="unstyled-list">
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
            </ul>
          </aside>
          <aside>
            <h3>After this session</h3>
            <ul className="unstyled-list">
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
              <li>
                <a href="/">Session name</a>
              </li>
            </ul>
          </aside>
        </section> */}
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
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const sessions = await fetchSessions();

  const session = sessions.find(
    (session: { slug: string }) => session.slug === params.slug
  );

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
    },
  };
}
