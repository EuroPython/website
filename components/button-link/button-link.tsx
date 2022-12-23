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
        "font-extrabold text-lg px-4 py-3 border-2 bg-primary border-primary inline-block leading-4",
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
