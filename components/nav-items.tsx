type Props = {
  items: { name: string; path: string; className?: string }[];
};

export const NavItems = ({ items }: Props) => {
  return (
    <ul>
      {items.map(({ name, path }) => (
        <li key={name}>
          <a href={path}>{name}</a>
        </li>
      ))}
    </ul>
  );
};
