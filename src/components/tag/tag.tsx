import clsx from "clsx";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export const Tag = ({ children, className, href }: TagProps) => {
  const TagElement = href ? "a" : "span";
  return (
    <TagElement
      className={clsx(
        "inline-block bg-secondary text-body px-4 py-2 rounded-xl font-bold",
        "hover:bg-primary hover:text-white transition-colors",
        "duration-200 ease-in-out cursor-pointer",
        className
      )}
      href={href}
    >
      {children}
    </TagElement>
  );
};
