import clsx from "clsx";

export const Link = ({
  href,
  children,
  className,
  node,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  node?: any;
}) => {
  return (
    <a
      className={clsx(
        "text-primary hover:text-primary-hover font-title font-bold underline",
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
};
