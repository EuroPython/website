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
      className="schedule-item rounded-lg bg-body-inverted text-green-300 flex flex-col"
      style={style}
      id={session.id}
    >
      <header
        className={clsx(
          "w-full rounded-t-lg bg-green-300 flex text-white justify-between text-xs py-2 px-3 font-bold leading-4",
          {
            "!bg-session-intermediate": session.audience === "intermediate",
            "!bg-session-advanced": session.audience === "advanced",
            "!bg-session-beginner": session.audience === "beginner",
            "!bg-green-300": [
              "keynote",
              "registration",
              "opening-session",
            ].includes(session.type),
          }
        )}
      >
        <p>{getHeaderText(session)}</p>

        <p>
          {session.type === "poster" ? (
            <>{numberToTime(session.time)} - </>
          ) : null}
          {session.duration}m
        </p>
      </header>

      <p className="font-bold text-base py-2 px-3">
        {session.slug ? (
          <a href={`/session/${session.slug}`}>{session.title}</a>
        ) : (
          session.title
        )}
        {session.start && session.end ? (
          <>
            {" "}
            <ICALLink
              className="calendar-link"
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
        <div className="mt-auto py-2 mx-3 mb-4 border-white border-t-[1px]">
          <>
            <div>
              <span>
                {nonEmptySpeakers.map((speaker, index) => (
                  <Fragment key={speaker.name}>
                    {speaker.slug ? (
                      <a
                        className="text-white underline text-sm font-bold"
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
      <div className="talk__mobile-details hidden">
        {roomsAndSpeakers.join(", ")}
      </div>
    </div>
  );
};
