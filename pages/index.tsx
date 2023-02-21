import { Hero } from "../components/hero";

import Head from "next/head";
import { useRef, useEffect } from "react";
import { Clacks } from "components/clacks";
import Link from "next/link";

export default function IndexPage() {
  const imageUrl = "https://ep2023.europython.eu/social-cards/default.png";
  const metaRef = useRef<HTMLMetaElement>(null);

  useEffect(() => {
    console.log("metaRef", metaRef.current);
    if (metaRef.current) {
      // add comment before meta tag
      metaRef.current.before(document.createComment("GNU Terry Pratchett"));
    }
  }, []);

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
          EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic &
          Remote
        </title>
        <meta
          name="title"
          content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote"
        />
        <meta name="description" content="" />
        <meta name="author" content="EuroPython" />

        <link rel="icon" href="/epslogo.png" type="image/png" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ep2023.europython.eu" />
        <meta
          property="og:title"
          content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote"
        />
        <meta property="og:description" content="" />
        <meta property="og:image" content={imageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ep2023.europython.eu" />
        <meta
          property="twitter:title"
          content="EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote"
        />
        <meta property="twitter:description" content="" />
        <meta property="twitter:image" content={imageUrl} />

        <Clacks />
      </Head>

      <div className="flex items-center justify-center content-center min-h-screen flex-col">
        <Hero />

        <Link href="/faq" className="block mt-2 underline">
          Frequently Asked Questions
        </Link>
      </div>
    </>
  );
}
