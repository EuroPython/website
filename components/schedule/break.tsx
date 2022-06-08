import { numberToTime, timeToNumber } from "./time-helpers";
import type { Event } from "../../types/schedule";

export const Break = ({
  event,
  style,
}: {
  event: Event & { type: "break" };
  style: React.CSSProperties;
}) => {
  return (
    <div className="break" style={style}>
      <span>{numberToTime(timeToNumber(event.time))}</span>
      <span className="break__description">{event.title}</span>
    </div>
  );
};
