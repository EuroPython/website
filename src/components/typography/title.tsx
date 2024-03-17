import clsx from "clsx";

export const Title = ({
  children,
  highlighted = false,
  level = 1,
  className,
  ...props
}: {
  children: React.ReactNode;
  highlighted?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={clsx(
        "relative font-title text-primary font-bold mb-[0.6em] [&>a]:border-0 [&>a]:text-inherit",
        {
          "text-4xl md:text-7xl": level === 1,
          "text-3xl md:text-5xl": level === 2,
          "text-2xl md:text-4xl": level === 3,
          "text-xl md:text-3xl": level === 4,
          "text-lg md:text-2xl": level === 5,
          "text-lg md:text-xl": level === 6,
        },
        className
      )}
      {...props}
    >
      {highlighted ? (
        <span
          className={clsx("absolute hidden xl:block text-body-light", {
            "-left-16": level === 1,
            "-left-12": level === 2,
            "-left-8": level === 3,
            "-left-4": level >= 4,
          })}
        >
          #
        </span>
      ) : null}

      {children}
    </Tag>
  );
};
