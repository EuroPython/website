import clsx from "clsx";

export const Break = ({
  title,
  time,
  style,
  className,
}: {
  time: string;
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
      <span>{time}</span>
      <span>{title}</span>
    </div>
  );
};
