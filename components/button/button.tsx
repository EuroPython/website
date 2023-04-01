import { clsx } from "clsx";

export const Button = ({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) => {

  return (
    <a
      className={clsx(
        "font-extrabold text-lg px-4 py-3 border-2 bg-secondary inline-block leading-4 min-w-[160px]",
        {
          "bg-secondary-darkest": secondary,
          "text-text-inverted": !secondary,
          "text-text": secondary,
        }
      )}
    >
      {children}
    </a>
  );
};
