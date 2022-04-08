import sponsors from "../data/sponsors.json";

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
    <div className="sponsors__tier">
      <h4 className="sponsors__tier-title">{tier.name}</h4>
      <div className="sponsors__logos">
        {tier.sponsors.map((sponsor) => (
          <a
            key={sponsor.url}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={sponsor.logo} alt={sponsor.name} />
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

  let className = "sponsors";
  if (noSponsors) {
    className += " sponsors--no-sponsors";
  }

  return (
    <div className={className}>
      <article>
        <div className="sponsors__intro">
          <div className="sponsors__intro-content">
            <h3 className="h4">Sponsors</h3>
            {noSponsors ? (
              <p>
                Sponsoring EuroPython guarantees you highly targeted visibility
                and the opportunity to present yourself and your company to one
                of the largest and most diverse Python communities in Europe and
                beyond.
              </p>
            ) : (
              <p>
                EuroPython wouldn't be such an affordable event without help of
                the sponsors. We'd like to thank all of them for their support.
              </p>
            )}
            <a href="/sponsor" className="button">
              Become a sponsor
            </a>
          </div>
          {topTier.sponsors.length > 0 && <SponsorTier tier={topTier} />}
        </div>
        {remaining.length > 0 && <hr />}

        {remaining.map((tier, index) => (
          <>
            <SponsorTier tier={tier} key={tier.name} />
            {index !== remaining.length - 1 && <hr />}
          </>
        ))}
      </article>
    </div>
  );
};
