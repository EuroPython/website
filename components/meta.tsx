import Head from "next/head";
import { Clacks } from "./clacks";
export const Meta = ({
  title = "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
  path,
  socialCardUrl,
}: {
  title?: string;
  path: string;
  socialCardUrl?: string;
}) => {
  const url = `https://ep2023.europython.eu/${path}`;
  // let imageUrl = path
  //   ? `https://ep2023.europython.eu/social-cards/${path}.png`
  //   : "https://ep2023.europython.eu/social-cards/default.png";

  // if (socialCardUrl) {
  //   imageUrl = socialCardUrl;
  // }

  const imageUrl = "https://ep2023.europython.eu/social-cards/default.png";

  return (
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

      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content="" />
      <meta name="author" content="EuroPython" />

      <link rel="icon" href="/epslogo.png" type="image/png" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="" />
      <meta property="og:image" content={imageUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content="" />
      <meta property="twitter:image" content={imageUrl} />

      <Clacks />
    </Head>
  );
};
