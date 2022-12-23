import clsx from "clsx";
import { Fragment } from "react";
import { ICALLink } from "../ical-link";
import { numberToTime } from "./time-helpers";
import type { Session as SessionType } from "./types";

const getHeaderText = (session: SessionType) => {
  if (session.type === "opening-session") {
    return "Opening";
  }

  if (session.type === "keynote") {
    return "Keynote";
  }

  if (session.type === "lightning-talks") {
    return "Lightning Talks";
  }

  if (session.type === "panel") {
    return "Panel";
  }

  if (session.type === "registration") {
    return "Registration";
  }

  if (session.audience) {
    return session.audience;
  }

  return session.type;
};

const SessionHeader = ({ session }: { session: SessionType }) => {
  return (
    <header
      className={clsx(
        "absolute right-0 top-0 bottom-0 w-5 rounded-r-lg whitespace-nowrap",
        "bg-secondary flex text-text justify-between text-xs py-2 px-3 font-bold leading-4",
        "lg:static lg:w-full lg:rounded-none lg:rounded-t-lg",
        {
          "!bg-session-intermediate": session.audience === "intermediate",
          "!bg-session-advanced": session.audience === "advanced",
          "!bg-session-beginner": session.audience === "beginner",
          "!bg-secondary": [
            "keynote",
            "registration",
            "opening-session",
          ].includes(session.type),
        }
      )}
    >
      <p
        className={clsx(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90",
          "lg:static lg:rotate-0 lg:translate-x-0 lg:translate-y-0"
        )}
      >
        {getHeaderText(session)}
      </p>

      <p className="hidden lg:block">
        {session.type === "poster" ? (
          <>{numberToTime(session.time)} - </>
        ) : null}
        {session.duration}m
      </p>
    </header>
  );
};

export const Session = ({
  session,
  style,
}: {
  session: SessionType;
  style: React.CSSProperties;
}) => {
  const speakers = session.speakers;

  const nonEmptySpeakers = speakers.filter((speaker) => speaker.name);

  const roomsAndSpeakers = session.rooms.concat(
    nonEmptySpeakers?.map((s) => s.name) || []
  );

  return (
    <div
      className={clsx(
        "schedule-item",
        "rounded-lg bg-body-inverted text-secondary flex flex-col relative mb-4 mx-4",
        "min-h-[100px] pr-6 lg:pr-0 lg:mb-0 lg:mx-0"
      )}
      style={style}
      id={session.id}
    >
      <SessionHeader session={session} />

      <p className="font-bold text-sm lg:text-base py-2 px-3">
        {session.slug ? (
          <a href={`/session/${session.slug}`}>{session.title}</a>
        ) : (
          session.title
        )}
        {session.start && session.end ? (
          <>
            {" "}
            <ICALLink
              className="absolute bottom-2 right-8 lg:static"
              title={session.title}
              description={session.abstract}
              start={session.start}
              end={session.end}
              room={session.rooms.join(", ")}
              url={`https://ep2022.europython.eu/session/${session.slug}`}
            />
          </>
        ) : null}
      </p>

      {nonEmptySpeakers.length ? (
        <div className="hidden lg:block mt-auto py-2 mx-3 mb-4 border-text border-t-[1px]">
          <>
            <div>
              <span>
                {nonEmptySpeakers.map((speaker, index) => (
                  <Fragment key={speaker.name}>
                    {speaker.slug ? (
                      <a
                        className="text-text underline text-sm font-bold"
                        href={`/speaker/${speaker.slug}`}
                      >
                        {speaker.name}
                      </a>
                    ) : (
                      speaker.name
                    )}
                    {index < nonEmptySpeakers.length - 1 && ", "}
                  </Fragment>
                ))}
              </span>
            </div>
          </>
        </div>
      ) : null}
      <div className="text-text text-sm font-bold mt-auto py-2 px-3 lg:hidden">
        {roomsAndSpeakers.join(", ")}
      </div>
    </div>
  );
};
