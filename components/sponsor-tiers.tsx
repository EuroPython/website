export const SponsorTiers = () => {
  return (
    <div className="tiers-grid">
      <div className="tier-card keystone">
        <h3>KeyStone</h3>
        <p className="tier-card__slots">1 slot available</p>
        <p className="tier-card__price">€42,000</p>
        <p className="tier-card__includes">This tier includes:</p>
        <ul>
          <li>Plenary room named after your company</li>
          <li>56 sqm booth in exhibit hall</li>
          <li>12 complimentary session passes</li>
          <li>Advertisement on virtual swag webpage</li>
          <li>One blog post on EuroPython's blog</li>
          <li>Access to recruiting session</li>
          <li>1 sponsored workshop (3 hours)</li>
          <li>1 sponsored talk (30 minutes)</li>
          <li>Private organisers support</li>
          <li>And more!</li>
        </ul>
      </div>
      <div className="tier-card diamond">
        <h3>Diamond</h3>
        <p className="tier-card__slots">2 slots available</p>
        <p className="tier-card__price">€30,000</p>
        <p className="tier-card__includes">This tier includes:</p>
        <ul>
          <li>30 sqm booth in exhibit hall</li>
          <li>8 complimentary session passes</li>
          <li>Advertisement on virtual swag webpage</li>
          <li>One blog post on EuroPython's blog</li>
          <li>Access to recruiting session</li>
          <li>1 sponsored talk (30 minutes)</li>
          <li>And more!</li>
        </ul>
      </div>
      <div className="tier-card platinum">
        <h3>Platinum</h3>
        <p className="tier-card__slots">4 slots available</p>
        <p className="tier-card__price">€17,000</p>
        <p className="tier-card__includes">This tier includes:</p>
        <ul>
          <li>16 sqm booth in exhibit hall</li>
          <li>6 complimentary session passes</li>
          <li>PDF brochure on virtual swag webpage</li>
          <li>Access to recruiting session</li>
          <li>1 sponsored talk (30 minutes)</li>
          <li>And more!</li>
        </ul>
      </div>
      <div className="tier-card gold">
        <h3>Gold</h3>
        <p className="tier-card__slots">Unlimited slots available</p>
        <p className="tier-card__price">€9,500</p>
        <p className="tier-card__includes">This tier includes:</p>
        <ul>
          <li>9 sqm booth in exhibit hall</li>
          <li>3 complimentary session passes</li>
          <li>PDF brochure on virtual swag webpage</li>
          <li>Access to recruiting session</li>
          <li>And more!</li>
        </ul>
      </div>
      <div className="tier-card silver">
        <h3>Silver</h3>
        <p className="tier-card__slots">Unlimited slots available</p>
        <p className="tier-card__price">€6,500</p>
        <p className="tier-card__includes">This tier includes:</p>
        <ul>
          <li>6 sqm booth in exhibit hall</li>
          <li>2 complimentary session passes</li>
          <li>Logo on EuroPython website</li>
          <li>And more!</li>
        </ul>
      </div>
      <div>
        <div className="tier-card bronze">
          <h3>Bronze</h3>
          <p className="tier-card__price">€2,000</p>
          <p className="tier-card__includes">Some text here</p>
        </div>
        <div className="tier-card patron">
          <h3>Patron</h3>
          <p className="tier-card__price">€1000</p>
          <p className="tier-card__includes">Some text here</p>
        </div>
      </div>
    </div>
  );
};
