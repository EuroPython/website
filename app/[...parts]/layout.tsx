import { Header } from "components/header";
import { Footer } from "components/footer";
import { ReactNode } from "react";

export const metadata = {
  title: {
    template:
      "%s | EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
  },
};

const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id="main-content" className="layout-wrapper">
      {children}
    </main>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      <Header />
      <div className="h-12"></div>

      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  );
}
