import { useState } from "react";
import { Layout } from "../components/layout";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { fetchSessions } from "../lib/sessions";
import { Title } from "components/typography/title";
import clsx from "clsx";
import { Prose } from "components/prose/prose";

type Session = {
  track: string;
  submission_type: string;
  code: string;
  slug: string;
  title: string;
  speakers: { name: string; slug: string }[];
  abstractSource: any;
};

const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => {
  return (
    <label htmlFor={htmlFor} className="block font-bold mb-4 pl-3 text-lg">
      {children}
    </label>
  );
};

const Select = ({
  children,
  id,
  name,
  className,
  onChange,
}: {
  children: React.ReactNode;
  id: string;
  name: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        onChange={onChange}
        className={clsx(
          "block w-full bg-body-inverted text-lg h-16 py-2 pr-16 pl-4 border-2 appearance-none",
          "focus:outline-none focus:border-primary-active",
          className
        )}
      >
        {children}
      </select>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 8"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
      >
        <path
          d="M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6z"
          fill="#FFF"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
};

const Tag = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={clsx(
        "inline-block bg-green-300 text-body px-4 py-2 rounded-xl font-bold",
        className
      )}
    >
      {children}
    </span>
  );
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
            <div key={session.code} className="mt-12">
              <Title level={2} highlighted className="!mb-6">
                <a
                  href={`/session/${session.slug}`}
                  className="hover:text-primary-hover"
                >
                  {session.title}
                </a>
              </Title>
              <p className="text-lg font-bold mb-4">
                {session.speakers.map((speaker, index) => (
                  <>
                    <a
                      href={`/speaker/${speaker.slug}`}
                      className="text-primary underline"
                    >
                      {speaker.name}
                    </a>
                    {index < session.speakers.length - 1 && ", "}
                  </>
                ))}
              </p>

              <Prose>
                <MDXRemote {...session.abstractSource} />
              </Prose>

              <p className="space-x-2">
                <Tag>{session.submission_type}</Tag>
                <Tag>{session.track}</Tag>
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
