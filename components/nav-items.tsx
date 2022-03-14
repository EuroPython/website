const NAVIGATION_ITEMS = [
  {
    name: "News",
    path: "/",
  },
  {
    name: "Registration",
    path: "/registration",
  },
  {
    name: "Setup",
    path: "/",
  },
  {
    name: "FAQ",
    path: "/faq",
  },
  {
    name: "Program",
    path: "/",
  },
  {
    name: "Sponsor",
    path: "/sponsor",
  },
];

type Props = {
  additionalItems?: { name: string; path: string; className?: string }[];
};

export const NavItems = ({ additionalItems }: Props) => {
  const items = [...(additionalItems || []), ...NAVIGATION_ITEMS];

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
