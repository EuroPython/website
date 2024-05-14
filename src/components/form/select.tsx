import clsx from "clsx";

export const Select = ({
  children,
  id,
  name,
  defaultValue,
}: {
  children: React.ReactNode;
  id: string;
  name: string;
  defaultValue?: string;
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={clsx(
          "block w-full bg-transparent text-lg h-16 py-2 pr-16 pl-4 border-[3px] border-primary appearance-none",
          "focus:outline-none focus:border-primary-active"
        )}
      >
        {children}
      </select>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 8"
        className={clsx(
          "absolute top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none text-primary right-4"
        )}
      >
        <path
          d="M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6z"
          className="fill-current"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
};
