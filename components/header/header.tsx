import { clsx } from "clsx";

import { Logo } from "components/logo";

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
      className={clsx(
        "border-white border-2 py-3 px-4 font-extrabold text-lg whitespace-nowrap",
        {
          "bg-white": variant !== "live",
          "text-black": variant !== "live",
          "bg-red": variant === "live",
        }
      )}
      href={href}
    >
      {children}
    </a>
  );
};

const HeaderLogo = () => {
  return (
    <a href="/">
      <Logo variant="small" className="w-11 h-auto mr-4 block md:hidden" />
      <Logo className="h-auto hidden md:block w-full pr-8" />
    </a>
  );
};
const HeaderActions = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <>
      <div className="ml-auto flex items-center">
        {!mobile ? <HeaderButton variant="live">Live 📹</HeaderButton> : null}

        <label htmlFor="nav_toggle" className="flex md:hidden ">
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

    <HeaderLogo />

    <nav className="mx-auto hidden md:block">
      <NavItems items={links.header} />
    </nav>

    <HeaderActions />

    <div className="fixed bg-green-800 top-0 left-0 w-screen h-screen overflow-scroll hidden peer-checked:block z-50 p-6">
      <div className="flex items-center">
        <HeaderLogo />
        <HeaderActions mobile />
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
