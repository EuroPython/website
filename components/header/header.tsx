import { clsx } from "clsx";
import { ButtonLink } from "components/button-link";

import { Logo } from "components/logo";
import { EPSLogo } from "components/logo/eps-logo";

import links from "../../data/links.json";

import { NavItems } from "../nav-items";

const IS_LIVE = false;

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
        "font-bold text-lg px-4 py-4 bg-secondary rounded-[60px] inline-block leading-4",
        "hover:bg-primary-hover hover:text-text-inverted",
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

const HeaderLogo = ({ inverted = false }: { inverted?: boolean }) => {
  return (
    <a href="/">
      <Logo className="w-11 h-auto mr-4 block md:hidden" inverted={inverted} />
      <Logo
        className="h-auto hidden md:block w-full pr-3 lg:pr-8"
        inverted={inverted}
      />
    </a>
  );
};

const HeaderLogoEPS = () => {
  return (
    <a href="/">
      <EPSLogo className="h-auto w-16 lg:w-32 pr-3 lg:pr-8" />
    </a>
  );
};

const HeaderActions = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <>
      <div className="ml-auto flex items-center space-x-4">
        {!mobile ? (
          <>
            <ButtonLink
              secondary
              href="https://www.europython-society.org/coc/"
            >
              <abbr title="Code of Conduct" className="no-underline lg:hidden">
                CoC
              </abbr>
              <span className="hidden lg:inline">Code of Conduct</span>
            </ButtonLink>
            {IS_LIVE && (
              <ButtonLink href="/live">
                Live
                <span className="hidden md:inline"> 📺</span>
              </ButtonLink>
            )}
          </>
        ) : null}

        {

        <label htmlFor="nav_toggle" className="flex lg:hidden">
          <HeaderButton variant="menu">
            {mobile ? "Close Menu" : "Menu"}
          </HeaderButton>
        </label>

        }
      </div>
    </>
  );
};

export const Header = ({ inverted = false }: { inverted?: boolean }) => (
  <header className={clsx("p-6 flex items-center relative z-40", {})}>
    <input
      type="checkbox"
      name="mobile-controls"
      id="nav_toggle"
      className="hidden peer"
      aria-hidden="true"
    />

    {/* <HeaderLogo inverted={inverted} /> */}

    <nav className="mr-auto hidden lg:block">
      <NavItems items={links.header} />
    </nav>

    <HeaderActions />

    <div className="fixed bg-body-background top-0 left-0 w-screen h-screen overflow-scroll hidden peer-checked:block lg:peer-checked:hidden z-50 p-6">
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
            /*
            {
              name: "Live 📺",
              path: "/live",
            },
            {
              name: "Buy tickets",
              path: "/tickets",
            }*/
            ...links.header,
          ]}
        />
      </nav>
    </div>
  </header>
);
