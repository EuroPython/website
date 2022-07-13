import links from "../data/links.json";

import { NavItems } from "./nav-items";

export const Header = () => (
  <header>
    <input
      type="checkbox"
      name="mobile-controls"
      id="nav_toggle"
      className="hide"
      aria-hidden="true"
    />
    <a href="/" className="visible-large">
      <span className="hide">EuroPython</span>
      <img
        src="/img/EP22logo.svg"
        className="header__logo"
        alt="EuroPython logo"
      />
    </a>

    <nav className="visible-large nav-desktop">
      <NavItems items={links.header} />
    </nav>
    <a
      className="button visible-large header-main-cta"
      href="https://www.europython-society.org/coc/"
    >
      Code of Conduct
    </a>

    <a
      className="button visible-large header-main-cta header-main-cta--live"
      href="/live"
    >
      Live 📹
    </a>

    <div className="header-controls hidden-large">
      <a href="/">
        <img
          src="/img/EP22logosmall.svg"
          className="header__logo"
          alt="EuroPython logo"
        />
      </a>
      <div>
        <a
          className="button header-main-cta header-main-cta--live"
          href="/live"
        >
          Live 📹
        </a>
        <label htmlFor="nav_toggle" className="button">
          Menu
        </label>
      </div>
    </div>

    <div className="header-mobile hidden-large">
      <div className="header-controls">
        <a href="/">
          <img
            src="/img/EP22logosmall.svg"
            className="header__logo"
            alt="EuroPython logo"
          />
        </a>
        <label htmlFor="nav_toggle" className="button">
          Close menu
        </label>
      </div>

      <nav className="header-mobile__navigation">
        <NavItems
          items={[
            {
              name: "Code of Conduct",
              path: "https://www.europython-society.org/coc/",
              className: "navigation__cta",
            },
            {
              name: "Live 📹",
              path: "/live",
              className: "navigation__cta",
            },
            {
              name: "Buy tickets",
              path: "/tickets",
              className: "navigation__cta",
            },
            ...links.header,
          ]}
        />
      </nav>
    </div>
  </header>
);
