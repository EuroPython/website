import clsx from "clsx";

import { format } from "date-fns";

export const Break = ({
  title,
  time,
  style,
  className,
}: {
  time: Date;
  title: date;
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
      <span>{format(time, "HH:mm")}</span>
      <span>{title}</span>
    </div>
  );
};
