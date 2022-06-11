import { numberToTime, timeToNumber } from "./time-helpers";

export const Break = ({
  title,
  time,
  style,
}: {
  time: number;
  title: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className="break" style={style}>
      <span>{numberToTime(time)}</span>
      <span className="break__description">{title}</span>
    </div>
  );
};
