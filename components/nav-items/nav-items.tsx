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
        <li key={item.name} className="border-b-2 border-green-500 md:border-0">
          <a
            href={item.path}
            className="font-bold inline-block w-full text-3xl md:text-base p-5 text-center"
          >
            {item.name}
          </a>

          {item.items ? (
            <ul className="mb-3 md:hidden">
              {item.items.map((subItem) => (
                <li key={subItem.name}>
                  <a
                    href={subItem.path || "#"}
                    className="bg-green-500 block w-full font-bold text-center mb-[2px] p-2"
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
