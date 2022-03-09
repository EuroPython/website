const NAVIGATION_ITEMS = [
  {
    name: "News",
    path: "/",
  },
  {
    name: "Registration",
    path: "/registration",
  },
  {
    name: "Setup",
    path: "/",
  },
  {
    name: "FAQ",
    path: "/faq",
  },
  {
    name: "Program",
    path: "/",
  },
  {
    name: "Sponsor",
    path: "/sponsor",
  },
];

export const Header = () => (
  <header>
    <input
      type="checkbox"
      name="mobile-controls"
      id="nav_toggle"
      className="hide"
      aria-hidden="true"
    />
    <a href="/index.html" className="visible-large">
      <span className="hide">EuroPython</span>
      <img
        src="/img/EP22logo.svg"
        className="header__logo"
        alt="EuroPython logo"
      />
    </a>

    <nav className="visible-large">
      <ul>
        {NAVIGATION_ITEMS.map(({ name, path }) => (
          <li key={name}>
            <a href={path}>{name}</a>
          </li>
        ))}
      </ul>
    </nav>
    <a className="button visible-large" href="/">
      Buy tickets
    </a>

    <div className="header-controls hidden-large">
      <a href="/index.html">
        <img
          src="img/EP22logosmall.svg"
          className="header__logo"
          alt="EuroPython logo"
        />
      </a>
      <div>
        <a className="button" href="/">
          Buy tickets
        </a>
        <label htmlFor="nav_toggle" className="button">
          Menu
        </label>
      </div>
    </div>

    <div className="header-mobile hidden-large">
      <div className="header-controls">
        <a href="/index.html">
          <img
            src="img/EP22logosmall.svg"
            className="header__logo"
            alt="EuroPython logo"
          />
        </a>
        <label htmlFor="nav_toggle" className="button">
          Close menu
        </label>
      </div>

      <nav className="header-mobile__navigation">
        <ul>
          <li>
            <a href="/" className="navigation__cta">
              Buy tickets
            </a>
          </li>
          {NAVIGATION_ITEMS.map(({ name, path }) => (
            <li key={name}>
              <a href={path}>{name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);
