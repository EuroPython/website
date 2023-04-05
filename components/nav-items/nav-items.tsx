import clsx from "clsx";

type Item = {
  name: string;
  path?: string;
  items?: Item[];
};

type Props = {
  items: Item[];
  inverted?: boolean;
};

export const NavItems = ({ items, inverted = false }: Props) => {
  return (
    <ul className="flex flex-col lg:flex-row">
      {items.map((item) => (
        <li
          key={item.name}
          className={clsx(
            "border-b border-border-secondary-dark lg:border-0 group",
            {
              "text-white": inverted,
              "text-primary": !inverted,
            }
          )}
        >
          <a
            href={item.path}
            className={clsx(
              "font-bold inline-block w-full text-3xl lg:text-base p-5 text-center",
              "lg:text-left lg:mt-4 lg:p-2 lg:px-5",
              "lg:group-hover:bg-secondary lg:group-hover:rounded-[30px]"
            )}
          >
            {item.name}
            {item.path?.startsWith("http") ? <span> ↗</span> : null}
          </a>

          {item.items ? (
            <div className="lg:hidden lg:group-hover:block lg:absolute z-50">
              <ul className="mb-3 lg:bg-secondary lg:mt-2 lg:rounded-[30px]">
                {item.items.map((subItem) => (
                  <li
                    key={subItem.name}
                    className={clsx(
                      "bg-secondary text-white block w-full font-bold text-center",
                      "lg:text-left lg:hover:bg-secondary-light",
                      "lg:first:rounded-t-[30px] lg:first:pt-2",
                      "lg:last:rounded-b-[30px] lg:last:pb-2"
                    )}
                  >
                    <a
                      href={subItem.path || "#"}
                      className={clsx(
                        "block w-full font-bold text-center",
                        "lg:text-left mb-[2px] p-2 lg:px-5"
                      )}
                    >
                      {subItem.name}
                      {subItem.path?.startsWith("http") ? (
                        <span> ↗</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
