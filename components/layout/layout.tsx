import clsx from "clsx";
import { ReactNode } from "react";
import { Footer } from "../footer";
import { Header } from "../header";

const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id="main-content" className="layout-wrapper">
      {children}
    </main>
  );
};

export const Layout = ({
  children,
  headerInverted = false,
}: {
  children: ReactNode;
  headerInverted?: boolean;
}) => {
  return (
    <>
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
