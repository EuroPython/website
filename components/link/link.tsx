import clsx from "clsx";

export const Link = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a
      className={clsx(
        "text-primary hover:text-primary-hover font-title font-bold border-b-2",
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
};
