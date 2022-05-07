type Item = {
  name: string;
  path: string;
  className?: string;
  items?: Item[];
};

type Props = {
  items: Item[];
};

export const NavItems = ({ items }: Props) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.name} className={item.items ? "has-dropdown" : ""}>
          <a href={item.path}>{item.name}</a>

          {item.items ? (
            <ul className="dropdown-menu">
              {item.items.map((subItem) => (
                <li key={subItem.name}>
                  <a href={subItem.path}>{subItem.name}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
