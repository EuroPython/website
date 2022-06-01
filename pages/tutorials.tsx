import { useState } from "react";
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

export default function SessionsPage({
  sessions,
  tracks,
  submissionTypes,
}: {
  sessions: Session[];
  tracks: string[];
  submissionTypes: string[];
}) {
  const [filters, setFilters] = useState({
    track: "",
    submission_type: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((preFilters) => ({
      ...preFilters,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout title="Accepted tutorials - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote">
      <main id="main-content">
        <h1>
          Accepted tutorials
          <p style={{ fontWeight: "normal" }}>Note: this list might change</p>
        </h1>

        <form>
          <h2>Filters</h2>
          <div>
            <label htmlFor="track">Track</label>
            <select name="track" id="track" onChange={handleFilterChange}>
              <option value="">All</option>
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>
        </form>

        {sessions
          .filter((session) => {
            if (filters.track && filters.track !== session.track) {
              return false;
            }
            if (
              filters.submission_type &&
              filters.submission_type !== session.submission_type
            ) {
              return false;
            }
            return true;
          })
          .map((session) => (
            <div key={session.code} className="session-card">
              <h2 className="highlighted">
                <a href={`/session/${session.slug}`}>{session.title}</a>
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
  const sessions = (
    await Promise.all(
      require(`../data/sessions/list.json`).map(
        async (session: { abstract: string }) => {
          const mdxSource = await serialize(session.abstract, {});

          return {
            ...session,
            abstractSource: mdxSource,
          };
        }
      )
    )
  ).filter((session) => session.submission_type === "Tutorial");

  const tracks = Array.from(new Set(sessions.map((session) => session.track)));
  const submissionTypes = Array.from(
    new Set(sessions.map((session) => session.submission_type))
  );
  tracks.sort();

  return {
    props: {
      sessions: sessions,
      tracks,
    },
  };
}
