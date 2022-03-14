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

    <nav className="visible-large">
      <NavItems items={links.header} />
    </nav>
    <a className="button visible-large" href="/">
      Buy tickets
    </a>

    <div className="header-controls hidden-large">
      <a href="/">
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
        <a href="/">
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
        <NavItems
          items={[
            { name: "Buy tickets", path: "/", className: "navigation__cta" },
            ...links.header,
          ]}
        />
      </nav>
    </div>
  </header>
);
