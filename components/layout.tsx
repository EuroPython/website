import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { Meta } from "./meta";

export const Layout = ({
  children,
  path,
  title,
}: {
  children: ReactNode;
  path?: string;
  title?: string;
}) => {
  return (
    <>
      <Meta path={path || ""} title={title} />

      <a href="#main-content" className="hide">
        Skip to main content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
};
