import clsx from "clsx";

export const Tag = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={clsx(
        "inline-block bg-green-300 text-body px-4 py-2 rounded-xl font-bold",
        className
      )}
    >
      {children}
    </span>
  );
};

export const TagContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={clsx("space-x-2", className)}>{children}</div>;
};
