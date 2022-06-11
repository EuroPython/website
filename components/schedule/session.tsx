import type { Session as SessionType, TalkType } from "./types";

export const Session = ({
  session,
  style,
}: {
  session: SessionType & { type: TalkType | "lighting-talks" };
  style: React.CSSProperties;
}) => {
  const speakers = session.type === "lighting-talks" ? [] : session.speakers;

  const singleSpeaker = speakers?.length === 1;
  const firstSpeaker = speakers?.[0];

  return (
    <div className="talk" style={style}>
      {session.type !== "lighting-talks" ? (
        <p className={`talk__rating ${session.audience}`}>
          <span>{session.audience}</span>
        </p>
      ) : null}
      <p className="talk__title">
        {session.type === "talk" ? (
          <a href={`/session/${session.slug}`}>{session.title}</a>
        ) : (
          session.title
        )}
      </p>

      {speakers ? (
        <div className="talk__speaker">
          {singleSpeaker && firstSpeaker?.image ? (
            <img src={firstSpeaker.image} className="speaker__image" />
          ) : null}

          <div className="speaker__bio">
            <span className="speaker__name">
              {speakers?.map((s) => s.name).join(", ")}
            </span>
          </div>
        </div>
      ) : null}
      <div className="talk__mobile-details">
        {session.rooms.join(", ")}, {speakers?.map((s) => s.name).join(", ")}
      </div>
    </div>
  );
};
