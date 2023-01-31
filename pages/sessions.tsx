import { useState } from "react";
import { Layout } from "../components/layout";
import { fetchSessions } from "../lib/sessions";
import { Title } from "components/typography/title";
import { SessionSummary } from "components/session-summary/session-summary";
import { Label } from "components/form/label";
import { Select } from "components/form/select";
import { serialize } from "next-mdx-remote/serialize";

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
      <main id="main-content" className="px-6">
        <Title>
          Accepted sessions
          <p className="font-normal text-base mt-4">
            Note: this list might change
          </p>
        </Title>

        <form>
          <Title level={2}>Filters</Title>
          <div className="mb-4">
            <Label htmlFor="track">Track</Label>
            <Select name="track" id="track" onChange={handleFilterChange}>
              <option value="">All</option>
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="submission_type">Submission type</Label>
            <Select
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
            </Select>
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
            <SessionSummary key={session.code} session={session} />
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

  const tracks = Array.from(new Set(sessions.map((session) => session.track)));
  const submissionTypes = Array.from(
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
