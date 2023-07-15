import { Header } from "components/header";
import { Footer } from "components/footer";
import { ReactNode } from "react";

const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id="main-content" className="layout-wrapper px-6">
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
    <div className="flex flex-col items-stretch min-h-screen">
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      <Header />
      <div className="h-12"></div>

      <LayoutContainer>{children}</LayoutContainer>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
