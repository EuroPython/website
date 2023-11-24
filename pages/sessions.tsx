import { useState } from "react";
import { Layout } from "../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { fetchSessions } from "../lib/sessions";

type Session = {
  track: string;
  submission_type: string;
  code: string;
  slug: string;
  title: string;
  speakers: { name: string; slug: string }[];
  abstractSource: any;
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
    <Layout title="Accepted sessions - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote">
      <main id="main-content">
        <h1>
          Accepted sessions
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

          <div>
            <label htmlFor="submission_type">Submission type</label>
            <select
              name="submission_type"
              id="submission_type"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {submissionTypes.map((submissionType) => (
                <option key={submissionType} value={submissionType}>
                  {submissionType}
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
                {session.speakers.map((speaker, index) => (
                  <>
                    <a href={`/speaker/${speaker.slug}`}>{speaker.name}</a>
                    {index < session.speakers.length - 1 && ", "}
                  </>
                ))}
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
  const sessionsList = await fetchSessions();
  const sessions = await Promise.all(
    sessionsList.map(async (session: { abstract: string }) => {
      const mdxSource = await serialize(session.abstract, {});

      return {
        ...session,
        abstractSource: mdxSource,
      };
    })
  );

  // @ts-ignore
  const tracks = Array.from(new Set(sessions.map((session) => session.track)));
  const submissionTypes = Array.from(
    // @ts-ignore
    new Set(sessions.map((session) => session.submission_type))
  );
  tracks.sort();
  submissionTypes.sort();

  return {
    props: {
      sessions: sessions,
      tracks,
      submissionTypes,
    },
    revalidate: 60,
  };
}
