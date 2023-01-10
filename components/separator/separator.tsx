import clsx from "clsx";

export const Separator = ({ light = false }: { light?: boolean }) => (
  <hr
    className={clsx("border-none h-[2px] my-12", {
      "bg-secondary-dark": !light,
      "bg-secondary": light,
    })}
  />
);
