import { Title } from "components/typography/title";
import React from "react";

export const HeroWithCTA = ({
  children,
  ctaTitle,
  ctaButton,
}: {
  ctaTitle: string;
  ctaButton: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="md:grid gap-12 grid-cols-[40rem_1fr]">
      <div>{children}</div>

      <div className="flex items-end justify-center">
        <div className="relative -top-12 text-center">
          <Title level={3} className="font-bold text-3xl mb-4">
            {ctaTitle}
          </Title>

          {ctaButton}
        </div>
      </div>
    </div>
  );
};
