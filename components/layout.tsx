import Head from "next/head";
import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const Layout = ({
  children,
  path,
}: {
  children: ReactNode;
  path?: string;
}) => {
  const url = `https://ep2022.europython.eu/${path}`;
  const imageUrl = path
    ? `https://ep2022.europython.eu/social-cards/${path}.png`
    : "https://ep2022.europython.eu/social-cards/default.png";

    console.log(url, imageUrl)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <meta httpEquiv="cleartype" content="on" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />

        <link
          rel="alternate"
          type="application/rss+xml"
          title="EuroPython Blog RSS Feed"
          href="http://blog.europython.eu/rss"
        />

        <title>
          EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote
        </title>
        <meta
          name="title"
          content="EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
        />
        <meta name="description" content="" />
        <meta name="author" content="EuroPython" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content="EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
        />
        <meta property="og:description" content="" />
        <meta property="og:image" content={imageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta
          property="twitter:title"
          content="EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
        />
        <meta property="twitter:description" content="" />
        <meta property="twitter:image" content={imageUrl} />

        <script
          defer
          data-domain="ep2022.europython.eu"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>

      <a href="#main-content" className="hide">
        Skip to main content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
};
