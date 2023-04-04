import { clsx } from "clsx";

export const ButtonLink = ({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) => {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={clsx(
        "font-bold text-lg px-4 py-4 bg-secondary rounded-[60px] inline-block leading-4",
        "hover:bg-primary-hover hover:text-text-inverted",
        {
          "bg-secondary-darkest": secondary,
          "text-text-inverted": !secondary,
          "text-text": secondary,
        }
      )}
      href={href}
    >
      {children}

      {isExternal && (
        <span className="inline-block ml-1 font-system text-lg leading-4">
          ↗
        </span>
      )}
    </a>
  );
};
