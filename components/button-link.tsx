export const ButtonLink = ({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;

  secondary?: boolean;
}) => {
  return (
    <a className={`button ${secondary ? "secondary" : ""}`} href={href}>
      {children}
    </a>
  );
};