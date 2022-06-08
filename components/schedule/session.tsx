import type { Event, TalkType } from "../../types/schedule";

export const Session = ({
  event,
  style,
}: {
  event: Event & { type: TalkType | "lighting-talks" };
  style: React.CSSProperties;
}) => {
  const speakers = event.type === "lighting-talks" ? [] : event.speakers;

  const singleSpeaker = speakers?.length === 1;
  const firstSpeaker = speakers?.[0];

  return (
    <div className="talk" style={style}>
      {event.type !== "lighting-talks" && (
        <p className={`talk__rating ${event.audience}`}>
          <span>{event.audience}</span>
        </p>
      )}
      <p className="talk__title">
        {event.type === "talk" ? (
          <a href={`/session/${event.slug}`}>{event.title}</a>
        ) : (
          event.title
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
        {event.rooms.join(", ")}, {speakers?.map((s) => s.name).join(", ")}
      </div>
    </div>
  );
};
