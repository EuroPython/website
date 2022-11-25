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

  const roomsAndSpeakers = session.rooms.concat(
    speakers?.map((s) => s.name) || []
  );

  return (
    <div className="talk schedule-item" style={style} id={session.id}>
      <header className={`${session.audience || ""} session-${session.type}`}>
        <p className={`talk__rating`}>{getHeaderText(session)}</p>

        <p className={`talk__duration`}>
          {session.type === "poster" ? (
            <>{numberToTime(session.time)} - </>
          ) : null}
          {session.duration}m
        </p>
      </header>
      <p className="talk__title">
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

      {speakers.length ? (
        <div className="talk__speaker">
          <>
            <div className="speaker__bio">
              <span className="speaker__name">
                {speakers.map((speaker, index) => (
                  <>
                    {speaker.slug ? (
                      <a href={`/speaker/${speaker.slug}`}>{speaker.name}</a>
                    ) : (
                      speaker.name
                    )}
                    {index < session.speakers.length - 1 && ", "}
                  </>
                ))}
              </span>
            </div>
          </>
        </div>
      ) : null}
      <div className="talk__mobile-details">{roomsAndSpeakers.join(", ")}</div>
    </div>
  );
};
