import clsx from "clsx";

import { formatInTimeZone } from "date-fns-tz";

export const Break = ({
  title,
  time,
  style,
  className,
}: {
  time: Date;
  title: string;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-2 font-bold bg-secondary-light min-h-[66px]",
        className
      )}
      style={style}
    >
      <span>{formatInTimeZone(time, "Europe/Prague", "HH:mm")}</span>
      <span>{title}</span>
    </div>
  );
};
