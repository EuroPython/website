import clsx from "clsx";
import { Title } from "../typography/title";

import type { SVGProps } from "react";

const Ribbon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="95px"
    height="200px"
    viewBox="0 0 105 180"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="overlay">
        <stop stopColor="#ffffff" offset="0%" stopOpacity={0.4} />
        <stop stopColor="#ffffff" offset="80%" stopOpacity={0} />
      </linearGradient>
    </defs>

    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-805.000000, -3436.000000)" fill="currentColor">
        <g id="Tiers" transform="translate(90.000000, 2384.000000)">
          <g id="Silver" transform="translate(437.000000, 1042.000000)">
            <g id="Silver-Tag" transform="translate(278.000000, 10.000000)">
              <polygon
                id="Rectangle"
                points="0 0 95 0 95 200 47.5 164.192211 0 200"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-805.000000, -3436.000000)" fill="url(#overlay)">
        <g id="Tiers" transform="translate(90.000000, 2384.000000)">
          <g id="Silver" transform="translate(437.000000, 1042.000000)">
            <g id="Silver-Tag" transform="translate(278.000000, 10.000000)">
              <polygon
                id="Rectangle"
                points="0 0 95 0 95 200 47.5 164.192211 0 200"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const SponsorTier = ({
  title,
  totalSlots,
  price,
  features,
}: {
  title: string;
  totalSlots?: number | null | string;
  price: number | string;
  features: string[];
}) => {
  const formattedPrice =
    typeof price === "number"
      ? new Intl.NumberFormat("en", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(price)
      : price;

  return (
    <div className="bg-white text-black rounded-2xl p-6 relative not-prose">
      <div className="h-[160px]">
        <Ribbon
          className={clsx("absolute right-6 -top-6", {
            "text-sponsor-keystone": title === "Keystone",
            "text-sponsor-diamond": title === "Diamond",
            "text-sponsor-platinum": title === "Platinum",
            "text-sponsor-gold": title === "Gold",
            "text-sponsor-silver": title === "Silver",
            "text-sponsor-bronze": title === "Bronze",
            "text-sponsor-patron": title === "Patron",
          })}
        />

        <Title level={3} className="mt-0 !mb-2">
          {title}
        </Title>

        <div className="font-bold text-3xl">{formattedPrice}</div>
        <div className="text-xl">
          {totalSlots ? (
            <>
              <span>{totalSlots}</span> slot{totalSlots == 1 ? "" : "s"}{" "}
              available
            </>
          ) : (
            <>No slot available</>
          )}
        </div>
      </div>

      <p className="font-bold text-base">This tier includes:</p>
      <ul className="text-base">
        {features.map((feature) => (
          <li key={feature}>✔️ {feature}</li>
        ))}
      </ul>
    </div>
  );
};

export const SponsorTiers = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
      <SponsorTier
        title="Keystone"
        totalSlots={1}
        price="Please ask"
        features={[
          "Keynote (plenary) room named after your company",
          "Central sizable booth in exhibit hall",
          "12 complimentary session passes",
          "Logo on room lecterns, banners, videos, website, signage",
          "Blog post on conference website",
          "Access to recruiting session",
          "1 sponsored workshop (3 hours)",
          "1 sponsored talk (30 minutes)",
          "Private organisers support",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Diamond"
        totalSlots={2}
        price={30000}
        features={[
          "30 sqm booth in exhibit hall",
          "8 complimentary session passes",
          "Logo on room lecterns, banners, videos, website, signage",
          "Blog post on conference website",
          "Access to recruiting session",
          "1 sponsored talk (30 minutes)",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Platinum"
        totalSlots={4}
        price={17000}
        features={[
          "16 sqm booth in exhibit hall",
          "6 complimentary session passes",
          "Logo on banners, videos, website, signage",
          "PDF brochure on virtual swag webpage",
          "Access to recruiting session",
          "1 sponsored talk (30 minutes)",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Platinum X"
        totalSlots={4}
        price={14000}
        features={[
          "6 complimentary session passes",
          "Logo on banners, videos, website, signage",
          "PDF brochure on virtual swag webpage",
          "Access to recruiting session",
          "1 sponsored talk (30 minutes)",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Gold"
        price={9500}
        totalSlots={"limited"}
        features={[
          "9 sqm booth in exhibit hall",
          "3 complimentary session passes",
          "Logo on banners, videos, website, signage",
          "PDF brochure on virtual swag webpage",
          "Access to recruiting session",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Silver"
        price={6500}
        totalSlots={"limited"}
        features={[
          "6 sqm booth in exhibit hall",
          "2 complimentary session passes",
          "Logo on website, signage",
          "And more!",
        ]}
      />

      <SponsorTier
        title="Bronze"
        price={2000}
        totalSlots={"unlimited"}
        features={["Logo & recruiting ad on EuroPython website and more!"]}
      />

      <SponsorTier
        title="Patron"
        price={1000}
        totalSlots={"unlimited"}
        features={["Logo on EuroPython website, welcome tweet and more!"]}
      />

    </div>
  );
};
