import clsx from "clsx";
import { ReactNode } from "react";
import { Footer } from "../footer";
import { Header } from "../header";
import { Meta } from "../meta";

const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id="main-content" className="layout-wrapper">
      {children}
    </main>
  );
};

export const Layout = ({
  children,
  path,
  title,
  socialCardUrl,
  headerInverted = false,
}: {
  children: ReactNode;
  path?: string;
  title?: string;
  socialCardUrl?: string;
  headerInverted?: boolean;
}) => {
  return (
    <>
      <Meta path={path || ""} title={title} socialCardUrl={socialCardUrl} />

      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <Header inverted={headerInverted} />
      <div
        className={clsx("h-12", {
          "bg-primary": headerInverted,
        })}
      ></div>

      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  );
};
