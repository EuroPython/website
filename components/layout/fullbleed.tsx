import clsx from "clsx";
import { ReactNode } from "react";

export const Fullbleed = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={clsx("full-bleed", className)}>{children}</div>;
};
