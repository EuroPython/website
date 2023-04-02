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
            className="font-bold inline-block w-full text-3xl lg:text-base p-5 text-center lg:text-left lg:mt-4 lg:p-2 lg:px-5 lg:group-hover:bg-secondary"
          >
            {item.name}
            {item.path?.startsWith("http") ? <span> ↗</span> : null}
          </a>

          {item.items ? (
            <ul className="mb-3 lg:hidden lg:group-hover:block lg:absolute z-50 lg:bg-secondary">
              {item.items.map((subItem) => (
                <li key={subItem.name}>
                  <a
                    href={subItem.path || "#"}
                    className="bg-secondary text-white block w-full font-bold text-center lg:text-left mb-[2px] p-2 lg:px-5 lg:hover:bg-secondary-light"
                  >
                    {subItem.name}
                    {subItem.path?.startsWith("http") ? <span> ↗</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
