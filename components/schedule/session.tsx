import clsx from "clsx";
import { Fragment } from "react";
// import { ICALLink } from "../ical-link";
import { numberToTime, timeToNumber } from "./time-helpers";

import type { Session as SessionType } from "@/lib/pretix/schedule";

const capitalizeFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getHeaderText = (session: SessionType) => {
  const type = session.type?.toLowerCase();

  if (type === "keynote") {
    return "Keynote";
  }

  if (session.experience) {
    return capitalizeFirst(session.experience);
  }

  if (type === "sponsored") {
    return "Talk";
  }

  if (session.type) {
    return capitalizeFirst(session.type);
  }
};

const SessionHeader = ({ session }: { session: SessionType }) => {
  const hasBgColor = [
    ["keynote", "registration", "opening-session"].includes(
      session.type?.toLowerCase()
    ),
    session.experience === "beginner",
    session.experience === "intermediate",
    session.experience === "advanced",
  ].some(Boolean);

  return (
    <header
      className={clsx(
        "absolute right-0 top-0 bottom-0",
        "bg-secondary flex text-text justify-between text-xs py-2 px-3 font-bold leading-4",
        "lg:static lg:w-full border-b-2",
        {
          "!bg-session-intermediate": session.experience === "intermediate",
          "!bg-session-advanced": session.experience === "advanced",
          "!bg-session-beginner": session.experience === "beginner",
          "!bg-secondary": [
            "keynote",
            "registration",
            "opening-session",
          ].includes(session.type?.toLowerCase()),
          "bg-session-none": !hasBgColor,
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

      <p className="hidden lg:block">{session.duration}m</p>
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
  const speakers = session.persons;

  const nonEmptySpeakers = speakers.filter((speaker) => speaker.public_name);

  const roomsAndSpeakers = [session.room].concat(
    nonEmptySpeakers?.map((s) => s.public_name) || []
  );

  return (
    <li id={session.guid} className="contents">
      <a
        className={clsx(
          "schedule-item bg-body-background mt-[2px] ml-[2px] border-b-2",
          "text-black flex flex-col relative cursor-pointer hover:bg-[#faefe4]",
          "min-h-[100px] block",
          { "opacity-20": session.type === "break" }
        )}
        style={style}
        href={`/session/${session.slug}`}
      >
        <SessionHeader session={session} />

        <p className="font-bold text-md lg:text-base py-2 px-3">
          {session.slug ? (
            <a href={`/session/${session.slug}`}>{session.title}</a>
          ) : (
            session.title
          )}
          {session.start && session.end ? (
            <>
              {" "}
              {/* <ICALLink
              className="absolute bottom-2 right-8 lg:static"
              title={session.title}
              description={session.abstract}
              start={session.start}
              end={session.end}
              room={session.rooms.join(", ")}
              url={`https://ep2022.europython.eu/session/${session.slug}`}
            /> */}
            </>
          ) : null}
        </p>

        {nonEmptySpeakers.length ? (
          <div className="hidden lg:block mt-auto py-2 mx-3 mb-4 border-text border-t-[0.5px]">
            <>
              <div>
                <span>
                  {nonEmptySpeakers.map((speaker, index) => (
                    <Fragment key={speaker.public_name}>
                      {speaker.slug ? (
                        <a
                          className="text-text text-sm font-bold hover:underline"
                          href={`/speaker/${speaker.slug}`}
                        >
                          {speaker.public_name}
                        </a>
                      ) : (
                        speaker.public_name
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
      </a>
    </li>
  );
};
