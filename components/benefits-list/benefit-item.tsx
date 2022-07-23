export const BenefitItem = ({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon:
    | "award"
    | "headhunt"
    | "network"
    | "rocket"
    | "sponsor"
    | "target"
    | "transfer";
}) => {
  return (
    <li>
      <img src={`/img/icons/${icon}.svg`} />
      <div>
        <h5 className="h3">{title}</h5>
        <p>{children}</p>
      </div>
    </li>
  );
};
