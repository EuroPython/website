import { Children, cloneElement } from "react";

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

export const BenefitsList = ({ children }: { children: React.ReactNode }) => {
  const benefits = Children.toArray(children);

  const half = Math.ceil(benefits.length / 2);

  const firstHalf = benefits.slice(0, half);
  const secondHalf = benefits.slice(half, benefits.length);

  return (
    <ul className="benefits-list">
      <div className="column">
        {/* @ts-ignore */}
        {firstHalf.map((benefit, i) => cloneElement(benefit, { key: i }))}
      </div>
      <div className="column">
        {/* @ts-ignore */}
        {secondHalf.map((benefit, i) => cloneElement(benefit, { key: i }))}
      </div>
    </ul>
  );
};
