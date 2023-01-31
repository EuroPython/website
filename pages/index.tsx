import { Hero } from "../components/hero";

import Head from "next/head";

export default function IndexPage() {
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

        <title>EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote</title>
        <meta name="title" content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote" />
        <meta name="description" content="" />
        <meta name="author" content="EuroPython" />

        <link rel="icon" href="/epslogo.png" type="image/png" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ep2023.europython.eu" />
        <meta property="og:title" content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote" />
        <meta property="og:description" content="" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ep2023.europython.eu" />
        <meta property="twitter:title" content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote" />
        <meta property="twitter:description" content="" />
      </Head>

      <div className="flex items-center justify-center content-center min-h-screen">
        <Hero />
      </div>
    </>
  );
}
