import { format } from "date-fns";

export const Break = ({
  title,
  time,
  style,
}: {
  time: string;
  title: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className="schedule-item flex items-center justify-center gap-2 font-bold bg-secondary-light min-h-[66px]"
      style={style}
    >
      <span>{time}</span>
      <span>{title}</span>
    </div>
  );
};
