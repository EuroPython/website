const NAVIGATION_ITEMS = [
  {
    name: "CFP",
    path: "/cfp",
  },
  {
    name: "Mentorship",
    path: "/mentorship",
  },
  {
    name: "Finaid",
    path: "/finaid",
  },
  {
    name: "FAQ",
    path: "/faq",
  },
  {
    name: "Covid info",
    path: "/covid-info",
  },
  {
    name: "Sponsor",
    path: "/sponsor",
  },
];

type Props = {
  preItems?: { name: string; path: string; className?: string }[];
  postItems?: { name: string; path: string; className?: string }[];
};

export const NavItems = ({ preItems, postItems }: Props) => {
  const items = [
    ...(preItems || []),
    ...NAVIGATION_ITEMS,
    ...(postItems || []),
  ];

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
