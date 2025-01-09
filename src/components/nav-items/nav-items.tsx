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
    <ul className="flex flex-col xl:flex-row">
      {items.map((item) => (
        <li
          key={item.name}
          tabIndex={0}
          className={clsx(
            "border-b border-border-secondary-dark xl:border-0 group",
            {
              "text-white": inverted,
              "text-primary": !inverted,
            }
          )}
        >
          <a
            href={item.path}
            className={clsx(
              "font-bold inline-block w-full text-3xl xl:text-base p-5 text-center",
              "xl:text-left xl:p-2 xl:px-5",
              "xl:group-hover:bg-secondary xl:group-hover:rounded-[30px] xl:group-hover:text-white",
              "xl:group-focus-within:bg-secondary xl:group-focus-within:rounded-[30px] xl:group-focus-within:text-white"
            )}
          >
            {item.name}
            {item.path?.startsWith("http") ? <span> ↗</span> : null}
          </a>

          {item.items ? (
            <div
              className={clsx(
                "xl:hidden xl:group-hover:block xl:absolute z-50",
                "xl:group-focus-within:block"
              )}
            >
              <ul className="mb-3 xl:bg-secondary xl:mt-2 xl:rounded-[30px]">
                {item.items.map((subItem) => (
                  <li
                    key={subItem.name}
                    className={clsx(
                      "bg-secondary text-white block w-full font-bold text-center",
                      "xl:text-left xl:hover:bg-secondary-light",
                      "xl:first:rounded-t-[30px] xl:first:pt-2",
                      "xl:last:rounded-b-[30px] xl:last:pb-2"
                    )}
                  >
                    <a
                      href={subItem.path || "#"}
                      className={clsx(
                        "block w-full font-bold text-center",
                        "xl:text-left mb-[2px] p-2 xl:px-5"
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
