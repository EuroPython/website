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
    <li className="grid max-w-full grid-cols-[3rem_1fr] gap-5 mb-8">
      <img src={`/img/icons/${icon}.svg`} />
      <div>
        <h5 className="text-2xl font-bold">{title}</h5>
        <p>{children}</p>
      </div>
    </li>
  );
};
