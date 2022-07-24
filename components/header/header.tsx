import cx from "classnames";

import links from "../../data/links.json";

import { NavItems } from "../nav-items";

const HeaderButton = ({
  children,
  href,
  variant = "standard",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "standard" | "live";
}) => {
  return (
    <a
      className={cx("border-white border-2 py-3 px-4 font-extrabold text-lg", {
        "bg-white": variant !== "live",
        "text-black": variant !== "live",
        "bg-red": variant === "live",
      })}
      href={href}
    >
      {children}
    </a>
  );
};

const HeaderContent = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <>
      <a href="/">
        <img
          src="/img/EP22logosmall.svg"
          className="w-11 h-auto mr-4 block"
          alt="EuroPython logo"
        />
      </a>
      <div className="ml-auto">
        {!mobile ? <HeaderButton variant="live">Live 📹</HeaderButton> : null}

        <label htmlFor="nav_toggle">
          <HeaderButton>{mobile ? "Close menu" : "Menu"}</HeaderButton>
        </label>
      </div>
    </>
  );
};

export const Header = () => (
  <header className="p-6 flex items-center">
    <input
      type="checkbox"
      name="mobile-controls"
      id="nav_toggle"
      className="hidden peer"
      aria-hidden="true"
    />
    <a href="/" className="hidden">
      <span className="hide">EuroPython</span>
      <img
        src="/img/EP22logo.svg"
        className="header__logo"
        alt="EuroPython logo"
      />
    </a>

    <nav className="hidden">
      <NavItems items={links.header} />
    </nav>

    <HeaderContent />

    <div className="fixed bg-green-800 top-0 left-0 w-screen h-screen overflow-scroll hidden peer-checked:block z-10 p-6">
      <div className="flex items-center">
        <HeaderContent mobile />
      </div>

      <nav className="mt-8">
        <NavItems
          items={[
            {
              name: "Code of Conduct",
              path: "https://www.europython-society.org/coc/",
            },
            {
              name: "Live 📹",
              path: "/live",
            },
            {
              name: "Buy tickets",
              path: "/tickets",
            },
            ...links.header,
          ]}
        />
      </nav>
    </div>
  </header>
);
