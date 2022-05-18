import { Layout } from "../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

type Speaker = {
  code: string;
  name: string;
  avatar: string;
};

type Session = {
  title: string;
  slug: string;
  abstract: string;
  submission_type: string;
  track: string;
  speakers: Speaker[];
  abstractSource: any;
  code: string;
};

export default function SessionsPage({ sessions }: { sessions: Session[] }) {
  return (
    <Layout>
      <main id="main-content">
        <h1>Sessions list</h1>
        {sessions.map((session) => (
          <div key={session.code} className="session-card">
            <h2 className="highlighted">
              <a href={`/talks/${session.slug}`}>{session.title}</a>
            </h2>
            <p className="session-card__author">
              {session.speakers.map((speaker) => speaker.name).join(", ")}
            </p>

            <MDXRemote {...session.abstractSource} />

            <p>
              <span className="tag">{session.submission_type}</span>
              <span className="tag">{session.track}</span>
            </p>
          </div>
        ))}
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const sessions = await Promise.all(
    require(`../data/sessions/list.json`)
      .filter((session: { state: string }) => session.state === "confirmed")
      .map(async (session: { abstract: string }) => {
        const mdxSource = await serialize(session.abstract, {});

        return {
          ...session,
          abstractSource: mdxSource,
        };
      })
  );

  return {
    props: {
      sessions: sessions,
    },
  };
}
