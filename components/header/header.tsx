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
  variant?: "standard" | "menu" | "live";
}) => {
  return (
    <a
      className={clsx(
        "border-text border-2 py-3 px-4 font-extrabold text-lg whitespace-nowrap",
        "cursor-pointer hover:bg-primary-hover",
        {
          "bg-text": variant === "menu",
          "bg-primary": variant === "standard",
          "text-text-inverted": variant !== "live",
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
      <Logo className="h-auto hidden md:block w-full pr-3 lg:pr-8" />
    </a>
  );
};
const HeaderActions = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <>
      <div className="ml-auto flex items-center -space-x-1">
        {!mobile ? (
          <>
            <HeaderButton href="https://www.europython-society.org/coc/">
              <abbr title="Code of Conduct" className="no-underline lg:hidden">
                CoC
              </abbr>
              <span className="hidden lg:inline">Code of Conduct</span>
            </HeaderButton>
            <HeaderButton variant="live" href="/live">
              Live 📹
            </HeaderButton>
          </>
        ) : null}

        <label htmlFor="nav_toggle" className="flex md:hidden">
          <HeaderButton variant="menu">
            {mobile ? "Close Menu" : "Menu"}
          </HeaderButton>
        </label>
      </div>
    </>
  );
};

export const Header = () => (
  <header className="p-6 flex items-center relative z-20">
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

    <div className="fixed bg-secondary-darkest top-0 left-0 w-screen h-screen overflow-scroll hidden peer-checked:block md:peer-checked:hidden z-50 p-6">
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
