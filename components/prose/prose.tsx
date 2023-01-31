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
        "mb-4 prose prose-xl prose-li:m-0 prose-ul:m-0 prose-ul:mb-4 prose-li:list-disc prose-a:underline",
        "prose-h1:text-7xl prose-h2:text-5xl prose-h3:text-4xl prose-h4:text-3xl prose-h5:text-2xl prose-h6:text-xl",
        "prose-h1:text-text",
        "prose-a:text-text",
        "prose-a:hover:text-primary-hover",
        "prose-strong:text-text prose-strong:font-bold",
        className
      )}
    >
      {children}
    </div>
  );
};
