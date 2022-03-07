import Head from "next/head";
import { ReactChild } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const Layout = ({ children }: { children: ReactChild }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <meta http-equiv="cleartype" content="on" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

        <link
          rel="alternate"
          type="application/rss+xml"
          title="EuroPython Blog RSS Feed"
          href="http://blog.europython.eu/rss"
        />

        <link rel="shortcut icon" type="image/png" href="/favicon.png" />

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
        <meta property="og:url" content="https://ep2022.europython.eu/" />
        <meta
          property="og:title"
          content="EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
        />
        <meta property="og:description" content="" />
        <meta
          property="og:image"
          content="https://ep2022.europython.eu/2022-europython-social-card.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ep2022.europython.eu/" />
        <meta
          property="twitter:title"
          content="EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
        />
        <meta property="twitter:description" content="" />
        <meta
          property="twitter:image"
          content="https://ep2022.europython.eu/2022-europython-social-card.png"
        />

        <script
          defer
          data-domain="ep2022.europython.eu"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
};
