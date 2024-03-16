import clsx from "clsx";
import { Fragment } from "react";

import { formatInTimeZone } from "date-fns-tz";
import { isAfter, isBefore } from "date-fns";

const capitalizeFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getHeaderText = (session: {
  type: string;
  experience: string;
  title: string;
}) => {
  const type = session.type?.toLowerCase();

  if (type === "keynote") {
    return "Keynote";
  }

  if (type === "poster") {
    return "Poster";
  }

  if (session.experience) {
    return capitalizeFirst(session.experience);
  }

  if (type === "sponsored") {
    return "Talk";
  }

  if (session.title.toLowerCase().startsWith("registration")) {
    return "Registration";
  }

  if (session.type) {
    return capitalizeFirst(session.type);
  }
};

const SessionHeader = ({ session }: { session: any }) => {
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
        "md:static md:w-full border-l-2 md:border-l-0 md:border-b-2",
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
          "md:static md:rotate-0 md:translate-x-0 md:translate-y-0"
        )}
      >
        {getHeaderText(session)}
      </p>

      <p className="hidden md:block">{session.duration / session.slots}m</p>
    </header>
  );
};

const SessionNotes = ({
  session,
}: {
  session: {
    type: string;
    start: Date;
    end: Date;
  };
}) => {
  if (session.type.toLowerCase() === "free workshop") {
    return (
      <p className="text-[10px] font-normal italic m-0 leading-3 decoration-current decoration-dotted">
        Free workshop
        <br />
        Registration needed
      </p>
    );
  }

  if (session.type.toLowerCase() === "conference workshop") {
    return (
      <p className="text-[10px] font-normal italic m-0 leading-3 decoration-current decoration-dotted">
        Free for attendees
        <br />
        Registration needed
      </p>
    );
  }

  return null;
};

export const Session = ({
  session,
  style,
  className,
}: {
  session: {
    title: string;
    code: string;
    room?: string | null;
    start: Date;
    end: Date;
    href: string;
    speakers: {
      name: string;
      slug: string;
    }[];
    type: string;
    customRoom?: string | null;
  };
  style: React.CSSProperties;
  className?: string;
}) => {
  const roomsAndSpeakers = [session.room].concat(
    session.speakers.map((speaker: any) => speaker.name) || []
  );

  const now = new Date();

  const isLive = isBefore(session.start, now) && isAfter(session.end, now);

  return (
    <li className="contents" id={session.code}>
      <div
        className={clsx(
          "pr-4 md:pr-0 text-black flex flex-col relative cursor-pointer hover:bg-[#faefe4]",
          "min-h-[150px] block",
          {
            "bg-[#ffdcdc]": isLive,
            "bg-body-background": !isLive,
          },
          className
        )}
        style={style}
      >
        <SessionHeader session={session} />

        <a
          className="font-bold text-md md:text-base py-2 px-3 flex-1 max-w-md mb-1"
          href={session.href}
        >
          <SessionNotes session={session} />

          <div className="2xl:flex justify-between text-sm mb-1">
            {session.customRoom ? (
              <div className="mb-1 2xl:mb-0">{session.customRoom}</div>
            ) : null}
            <p className="hidden md:block">
              {formatInTimeZone(session.start, "Europe/Prague", "HH:mm")} -{" "}
              {formatInTimeZone(session.end, "Europe/Prague", "HH:mm")}
            </p>
          </div>

          <p>
            {isLive ? <span className="text-[#ff0000]">🔴 </span> : null}

            {session.title}
          </p>
        </a>

        {session.speakers.length ? (
          <div className="hidden md:block py-2 mx-3 mb-4 border-text border-t-[0.5px]">
            <>
              <div>
                <span>
                  {session.speakers.map((speaker: any, index: number) => (
                    <Fragment key={speaker.name}>
                      {speaker.slug ? (
                        <a
                          className="text-text text-sm font-bold hover:underline"
                          href={`/speaker/${speaker.slug}`}
                        >
                          {speaker.name}
                        </a>
                      ) : (
                        speaker.name
                      )}
                      {index < session.speakers.length - 1 && ", "}
                    </Fragment>
                  ))}
                </span>
              </div>
            </>
          </div>
        ) : null}
        <div className="text-text text-sm font-bold mt-auto py-2 px-3 md:hidden">
          {roomsAndSpeakers.join(", ")}
        </div>
      </div>
    </li>
  );
};
