import clsx from "clsx";

export const Prose = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "mb-4 prose-lg prose-li:m-0 prose-ul:m-0 prose-ul:mb-4 prose-li:list-disc",
        className
      )}
    >
      {children}
    </div>
  );
};
