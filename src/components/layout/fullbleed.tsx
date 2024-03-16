import clsx from "clsx";

export const Fullbleed = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => {
  return <div className={clsx("full-bleed", className)}>{children}</div>;
};
