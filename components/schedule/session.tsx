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

  const singleSpeaker = speakers?.length === 1;
  const firstSpeaker = speakers?.[0];

  return (
    <div className="talk" style={style} onClick={() => console.log(session)}>
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
      </p>

      {speakers.length ? (
        <div className="talk__speaker">
          <>
            {singleSpeaker && firstSpeaker?.image ? (
              <img src={firstSpeaker.image} className="speaker__image" />
            ) : null}
            <div className="speaker__bio">
              <span className="speaker__name">
                {speakers?.map((s) => s.name).join(", ")}
              </span>
            </div>
          </>
        </div>
      ) : null}
      <div className="talk__mobile-details">
        {session.rooms.join(", ")}, {speakers?.map((s) => s.name).join(", ")}
      </div>
    </div>
  );
};
