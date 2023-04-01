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
    <ul className="flex">
      {items.map((item) => (
        <li
          key={item.name}
          className={clsx(
            "border-b-2 border-secondary-dark md:border-0 group",
            {
              "text-white": inverted,
              "text-primary": !inverted,
            }
          )}
        >
          <a
            href={item.path}
            className="font-bold inline-block w-full text-3xl md:text-base p-5 text-center md:text-left md:mt-4 md:p-2 md:px-5 md:hover:bg-secondary"
          >
            {item.name}
            {item.path?.startsWith("http") ? <span> ↗</span> : null}
          </a>

          {item.items ? (
            <ul className="mb-3 md:hidden md:group-hover:block md:absolute z-50 md:bg-secondary-darkest">
              {item.items.map((subItem) => (
                <li key={subItem.name}>
                  <a
                    href={subItem.path || "#"}
                    className="bg-secondary-dark block w-full font-bold text-center md:text-left mb-[2px] p-2 md:px-5 md:hover:bg-secondary"
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
