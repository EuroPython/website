import { clsx } from "clsx";

export const ButtonLink = ({
  href,
  children,
  className,
  secondary = false,
  isExternal,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
  isExternal?: boolean; // Make isExternal an optional parameter
}) => {
  // default isExternal to href.startsWith("http") if not directly provided
  const resolvedIsExternal = isExternal ?? href.startsWith("http");

  return (
    <a
      className={clsx(
        "font-bold text-lg px-4 py-4 bg-button rounded-[60px] inline-block leading-4",
        "hover:bg-button-hover not-prose",
        {
          // yes, this is inverted :'D
          "bg-primary text-white hover:bg-primary-hover": secondary,
          "text-text-inverted": !secondary,
          "text-text": secondary,
        },
        className
      )}
      href={href}
    >
      {children}

      {resolvedIsExternal && (
        <span className="inline-block ml-1 font-system text-lg leading-4">
          ↗
        </span>
      )}
    </a>
  );
};
