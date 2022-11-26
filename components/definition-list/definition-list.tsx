import clsx from "clsx";

export const DefinitionList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <dl
      className={clsx(
        "grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2",
        className
      )}
    >
      {children}
    </dl>
  );
};

export const DefinitionTerm = ({ children }: { children: React.ReactNode }) => {
  return <dt className="font-bold">{children}</dt>;
};

export const DefinitionDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <dd>{children}</dd>;
};
