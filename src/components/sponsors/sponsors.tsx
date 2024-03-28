import { Separator } from "../separator/separator";
import { Fragment } from "react";
import sponsors from "../../data/sponsors.json";
import { Fullbleed } from "../layout/fullbleed";

import { ButtonLink } from "../button-link";
import { Title } from "../typography/title";
import clsx from "clsx";

type Sponsor = {
  name: string;
  logo: string;
  url: string;
};

type Tier = {
  name: string;
  sponsors: Sponsor[];
};

const SponsorTier = ({ tier, top = false }: { tier: Tier; top?: boolean }) => {
  return (
    <div className="relative">
      <h4 className="absolute w-10 font-bold top-0 bottom-0 font-title text-primary">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 block origin-center whitespace-nowrap">
          {tier.name}
        </span>
      </h4>
      <div
        className={clsx(
          "grid gap-12 sm:gap-6 ml-12 items-center justify-items-center",
          {
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3": !top,
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-2": top,
          },
        )}
      >
        {tier.sponsors.map((sponsor) => (
          <a
            key={sponsor.url}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="max-w-[250px] max-h-[120px]"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export const Sponsors = () => {
  const topTier = sponsors.tiers[0];
  const remaining = sponsors.tiers
    .slice(1)
    .filter((t) => t.sponsors.length > 0);

  const noSponsors = remaining.length + topTier.sponsors.length === 0;

  return (
    <Fullbleed className="bg-white py-24 px-6">
      <section className="max-w-4xl lg:max-w-6xl mx-auto mb-16">
        <div>
          <div className="flex gap-6">
            <div className="max-w-[250px]">
              <Title level={3}>Sponsors</Title>

              {noSponsors ? (
                <p>
                  Sponsoring EuroPython guarantees you highly targeted
                  visibility and the opportunity to present yourself and your
                  company to one of the largest and most diverse Python
                  communities in Europe and beyond.
                </p>
              ) : (
                <p>
                  EuroPython wouldn't be such an affordable event without help
                  of the sponsors. We'd like to thank all of them for their
                  support.
                </p>
              )}

              <div className="mt-4">
                <ButtonLink href="/sponsor">Become a sponsor</ButtonLink>
              </div>
            </div>

            {/* <Graphic className="ml-auto h-[250px]" /> */}
          </div>
          {topTier.sponsors.length > 0 && (
            <SponsorTier tier={topTier} top={true} />
          )}
        </div>

        {remaining.length > 0 && <Separator light />}

        {remaining.map((tier, index) => (
          <Fragment key={tier.name}>
            <SponsorTier tier={tier} top={tier.name === "Platinum"} />
            {index !== remaining.length - 1 && <Separator light />}
          </Fragment>
        ))}
      </section>
    </Fullbleed>
  );
};
