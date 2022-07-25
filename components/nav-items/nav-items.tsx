type Item = {
  name: string;
  path?: string;
  items?: Item[];
};

type Props = {
  items: Item[];
};

export const NavItems = ({ items }: Props) => {
  return (
    <ul className="md:grid grid-cols-3">
      {items.map((item) => (
        <li
          key={item.name}
          className="border-b-2 border-green-500 md:border-0 group"
        >
          <a
            href={item.path}
            className="font-bold inline-block w-full text-3xl md:text-base p-5 text-center md:text-left md:border-l-2 md:mt-4 md:p-2 md:px-5 md:hover:bg-green-300"
          >
            {item.name}
          </a>

          {item.items ? (
            <ul className="mb-3 md:hidden md:group-hover:block md:absolute z-10 md:bg-green-800 md:border-l-2">
              {item.items.map((subItem) => (
                <li key={subItem.name}>
                  <a
                    href={subItem.path || "#"}
                    className="bg-green-500 block w-full font-bold text-center md:text-left mb-[2px] p-2 md:px-5 md:hover:bg-green-300"
                  >
                    {subItem.name}
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
