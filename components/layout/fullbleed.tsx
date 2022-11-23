import { ReactNode } from "react";

export const Fullbleed = ({ children }: { children: ReactNode }) => {
  return <div className="full-bleed">{children}</div>;
};
