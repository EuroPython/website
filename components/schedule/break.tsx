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
    <div
      className="schedule-item flex items-center justify-center gap-2 font-bold bg-secondary-light min-h-[66px]"
      style={style}
    >
      <span>{numberToTime(time)}</span>
      <span>{title}</span>
    </div>
  );
};
