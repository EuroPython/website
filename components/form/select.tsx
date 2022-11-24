import clsx from "clsx";

export const Select = ({
  children,
  id,
  name,
  className,
  onChange,
}: {
  children: React.ReactNode;
  id: string;
  name: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        onChange={onChange}
        className={clsx(
          "block w-full bg-body-inverted text-lg h-16 py-2 pr-16 pl-4 border-2 appearance-none",
          "focus:outline-none focus:border-primary-active",
          className
        )}
      >
        {children}
      </select>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 8"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
      >
        <path
          d="M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6z"
          fill="#FFF"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
};
