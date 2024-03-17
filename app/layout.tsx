import "../styles/main.css";
import { Metadata } from "next";

import PlausibleProvider from "next-plausible";

export const metadata: Metadata = {
  title: {
    default:
      "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
    template: "%s | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
  },
  twitter: {
    title: {
      default:
        "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
      template: "%s | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
    },
  },
  metadataBase: new URL("https://ep2023.europython.eu/"),
  description: "",
  alternates: {
    types: { "application/rss+xml": "http://blog.europython.eu/rss" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/rhp8qny.css"
        ></link>
        <PlausibleProvider domain="ep2023.europython.eu" />
      </head>
      <body>
        <a
          href="https://europython.eu/"
          className="text-center px-2 bg-secondary text-white font-bold fixed top-0 w-full h-[40px] z-50 flex items-center justify-center"
        >
          This is the website for an older EuroPython. Looking for the latest
          EuroPython? Click here!
        </a>

        <div className="">{children}</div>
      </body>
    </html>
  );
}
