import clsx from "clsx";
import { Datetime } from "../datetime";
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription,
} from "../definition-list/definition-list";

import { Separator } from "../separator/separator";
import { TagContainer, Tag } from "../tag/tag";
import { Title } from "../typography/title";
import { formatInTimeZone } from "date-fns-tz";
import { getAvatarUrl } from "../../lib/get-avatar-url";
// import ReactMarkdown from "react-markdown";

const normalizeRoom = (room: string) => {
  return room.replace(/\[|\]/g, "").toLowerCase();
};
const Prose = ({ children }: { children: React.ReactNode }) => (
  <div className="prose">{children}</div>
);

const SessionNotes = ({
  session,
}: {
  session: {
    type: string;
  };
}) => {
  if (session.type.toLowerCase() === "free workshop") {
    return (
      <p className="text-sm text-black font-normal m-0 decoration-current decoration-dotted">
        Free workshop
        <br />
        Registration needed
      </p>
    );
  }

  if (session.type.toLowerCase() === "conference workshop") {
    return (
      <p className="text-sm text-black font-normal m-0 decoration-current decoration-dotted">
        Free for attendees
        <br />
        Registration needed
      </p>
    );
  }

  return null;
};

export const SessionPage = ({
  session,
  sessionsAfter,
  sessionsInParallel,
}: {
  session: {
    title: string;
    code: string;
    room?: string | null;
    start: Date | null;
    duration: number;
    abstract?: string;
    experience?: string;
    speakers: {
      name: string;
      avatar: string;
      bio: string;
      slug: string;
      code: string;
    }[];
    customRoom?: string | null;
    tags: string[];
    type: string;
    track?: string;
    description?: string;
    slidesUrl?: string | null;
  };
  sessionsAfter: {
    title: string;
    slug: string;
  }[];
  sessionsInParallel: {
    title: string;
    slug: string;
  }[];
}) => {
  return (
    <>
      <article className="accent-left">
        <header className="mb-6">
          <Title level={2}>
            {session.title}
            <SessionNotes session={session} />
          </Title>
          <DefinitionList>
            {session.experience ? (
              <>
                <DefinitionTerm>Level:</DefinitionTerm>
                <DefinitionDescription className="capitalize">
                  {session.experience}
                </DefinitionDescription>
              </>
            ) : null}
            {session.room ? (
              <>
                <DefinitionTerm>Room:</DefinitionTerm>
                <DefinitionDescription className="capitalize">
                  {normalizeRoom(session.customRoom || session.room)}
                </DefinitionDescription>
              </>
            ) : null}
            {session.start ? (
              <>
                <DefinitionTerm>Start:</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={session.start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={false}
                  />
                </DefinitionDescription>
                {/* <DefinitionTerm>Start (your time):</DefinitionTerm>
                <DefinitionDescription>
                  <Datetime
                    datetime={start}
                    format="HH:mm 'on' dd MMMM yyyy"
                    useUserTimezone={true}
                  />
                </DefinitionDescription> */}
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
            {/* <Prose> */}
            TODO
            {/* <ReactMarkdown components={components}>{session.abstract}</ReactMarkdown> */}
            {/* </Prose> */}
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
                  {/* <ReactMarkdown components={components}> */}
                  {session.description}
                  {/* </ReactMarkdown> */}
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

        {session.speakers.map((speaker) => {
          const avatar = getAvatarUrl(speaker.avatar);

          return (
            <div
              key={speaker.code}
              className={clsx("mb-4", {
                "md:grid grid-cols-[260px_1fr] md:gap-6": !!avatar,
              })}
            >
              {avatar && (
                <div className="flex items-start mb-4">
                  <img
                    src={avatar}
                    alt={speaker.name}
                    className="w-full max-w-sm mb-12"
                  />
                </div>
              )}

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
                  {/* <ReactMarkdown components={components}> */}
                  {speaker.bio}
                  {/* </ReactMarkdown> */}
                </Prose>
              </div>
            </div>
          );
        })}
      </article>

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

      {session.start ? (
        <>
          <Separator />

          <a
            className="block text-6xl font-bold text-center hover:text-primary-hover mt-24 mb-12"
            href={`/schedule/${formatInTimeZone(
              session.start,
              "Europe/Prague",
              "yyyy-MM-dd",
            )}#${session.code}`}
          >
            ← Back to schedule
          </a>
        </>
      ) : null}
    </>
  );
};
