import { Children, cloneElement } from "react";

export const BenefitsList = ({ children }: { children: React.ReactNode }) => {
  const benefits = Children.toArray(children);

  const half = Math.ceil(benefits.length / 2);

  const firstHalf = benefits.slice(0, half);
  const secondHalf = benefits.slice(half, benefits.length);

  return (
    <ul className="gap-5 md:grid grid-cols-2">
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
