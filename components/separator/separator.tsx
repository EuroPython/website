import clsx from "clsx";

export const Separator = ({ light = false }: { light?: boolean }) => (
  <hr
    className={clsx("border-none  h-[2px] my-12", {
      "bg-green-500": !light,
      "bg-green-300": light,
    })}
  />
);
