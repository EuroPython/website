import clsx from "clsx";

export const Separator = ({ light = false }: any) => (
  <hr
    className={clsx("border-none h-[2px] my-12", {
      "bg-secondary": !light,
      "bg-primary": light,
    })}
  />
);
