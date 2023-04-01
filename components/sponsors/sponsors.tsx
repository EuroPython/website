import { Separator } from "components/separator/separator";
import { Fragment } from "react";
import sponsors from "../../data/sponsors.json";
import { Fullbleed } from "components/layout/fullbleed";

import { ButtonLink } from "components/button-link";
import { Title } from "components/typography/title";

type Sponsor = {
  name: string;
  logo: string;
  url: string;
};

type Tier = {
  name: string;
  sponsors: Sponsor[];
};

const SponsorTier = ({ tier }: { tier: Tier }) => {
  return (
    <div className="relative">
      <h4 className="absolute w-10 font-bold top-0 bottom-0 font-title text-primary">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 block origin-center whitespace-nowrap">
          {tier.name}
        </span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-6 ml-12 items-center justify-items-center">
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

const Graphic = ({ className }: { className?: string }) => {
  return (
    <svg
      width="604"
      height="300"
      viewBox="0 0 604 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect y="149" width="151" height="151" fill="#FF8B9D" />
      <rect y="224.5" width="75.5" height="75.5" fill="#FF8B9D" />
      <rect x="76.104" y="149" width="74.896" height="76.104" fill="#0009E7" />
      <path
        d="M0 224.5C0 266.197 33.8025 300 75.5 300V149C33.8025 149 0 182.803 0 224.5Z"
        fill="#FF0000"
      />
      <path
        d="M151 224.5C151 182.803 117.198 149 75.5 149L75.5 300C117.197 300 151 266.197 151 224.5Z"
        fill="#FFB340"
      />
      <rect x="151" width="151" height="151" fill="#0009E7" />
      <path d="M302 151H151V126.573V0L302 151Z" fill="#FF0000" />
      <path
        d="M221.364 39.9C208.302 42.3333 198.361 53.9333 197.998 67.95H151.198C151.116 67.5667 151.05 67.1667 151 66.7667C151.512 40.25 169.314 17 194.91 6.28332C204.52 2.24998 215.205 0 226.5 0C268.312 0 302 30.95 302 67.95H255.002C254.573 52.1333 241.94 39.4167 226.5 39.4167C224.75 39.4167 223.032 39.5833 221.364 39.9Z"
        fill="white"
      />
      <rect x="302" y="149" width="151" height="151" fill="white" />
      <path d="M453 249.037V300H426.901V299.802L453 249.037Z" fill="#0009E7" />
      <path
        d="M453 216.221V249.667H360.39C362.691 241.848 363.933 233.439 363.933 224.7C363.933 221.833 363.792 219.001 363.538 216.221H453Z"
        fill="#0009E7"
      />
      <path
        d="M453 182.793V216.221H363.538C362.38 203.955 358.766 192.557 353.289 182.793H453Z"
        fill="white"
      />
      <path
        d="M453 149.347V182.793H353.289C342.164 162.969 323.388 149.799 302 149.365V149.017C302.282 149 302.579 149 302.861 149H453V149.347Z"
        fill="#0009E7"
      />
      <path
        d="M426.901 249.037V300H410.869H402.667V299.676L426.479 249.037H426.901Z"
        fill="#0009E7"
      />
      <path
        d="M402.667 299.676V300H374.704V299.802L402.181 249.037H402.667V299.676Z"
        fill="#0009E7"
      />
      <path
        d="M374.704 299.802V300H374.67H324.958H305.729V299.802L373.306 249.037H374.704V299.802Z"
        fill="#0009E7"
      />
      <path
        d="M367.717 249.667V250.727H367.138L339.157 299.809V300H303.158C329.656 298.888 352.004 278.195 360.39 249.667H367.717Z"
        fill="#0009E7"
      />
      <path
        d="M377.5 224.5C377.5 182.802 343.698 149 302 149L302 300C343.697 300 377.5 266.197 377.5 224.5Z"
        fill="#FFB340"
      />
      <rect x="453" width="151" height="151" fill="white" />
      <path
        d="M453 101.796V0H604V151H453V101.796ZM562.175 43.6616C562.175 37.4764 557.156 32.4552 550.955 32.4552C544.754 32.4552 539.752 37.4764 539.752 43.6616C539.752 49.8469 544.772 54.8854 550.955 54.8854C557.138 54.8854 562.175 49.8642 562.175 43.6616ZM562.175 77.75C562.175 71.5647 557.156 66.5435 550.955 66.5435C544.754 66.5435 539.752 71.5647 539.752 77.75C539.752 83.9352 544.772 88.9564 550.955 88.9564C557.138 88.9564 562.175 83.9352 562.175 77.75ZM562.175 111.838C562.175 105.653 557.156 100.632 550.955 100.632C544.754 100.632 539.752 105.653 539.752 111.838C539.752 118.024 544.772 123.045 550.955 123.045C557.138 123.045 562.175 118.024 562.175 111.838ZM517.086 43.6616C517.086 37.4764 512.066 32.4552 505.883 32.4552C499.7 32.4552 494.68 37.4764 494.68 43.6616C494.68 49.8469 499.7 54.8854 505.883 54.8854C512.066 54.8854 517.086 49.8642 517.086 43.6616ZM517.086 77.75C517.086 71.5647 512.066 66.5435 505.883 66.5435C499.7 66.5435 494.68 71.5647 494.68 77.75C494.68 83.9352 499.7 88.9564 505.883 88.9564C512.066 88.9564 517.086 83.9352 517.086 77.75ZM517.086 111.838C517.086 105.653 512.066 100.632 505.883 100.632C499.7 100.632 494.68 105.653 494.68 111.838C494.68 118.024 499.7 123.045 505.883 123.045C512.066 123.045 517.086 118.024 517.086 111.838Z"
        fill="#FF8B9D"
      />
    </svg>
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

            <Graphic className="ml-auto h-[250px]" />
          </div>
          {topTier.sponsors.length > 0 && <SponsorTier tier={topTier} />}
        </div>

        {remaining.length > 0 && <Separator light />}

        {remaining.map((tier, index) => (
          <Fragment key={tier.name}>
            <SponsorTier tier={tier} />
            {index !== remaining.length - 1 && <Separator light />}
          </Fragment>
        ))}
      </section>
    </Fullbleed>
  );
};
