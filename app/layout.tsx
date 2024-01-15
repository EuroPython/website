import "../styles/main.css";
import { Metadata } from "next";

import PlausibleProvider from "next-plausible";

export const metadata: Metadata = {
  title: {
    default:
      "EuroPython 2024 | July 8th-14th 2024 | Prague, Czech Republic & Remote",
    template: "%s | July 8th-14th 2024 | Prague, Czech Republic & Remote",
  },
  twitter: {
    title: {
      default:
        "EuroPython 2024 | July 8th-14th 2024 | Prague, Czech Republic & Remote",
      template: "%s | July 8th-14th 2024 | Prague, Czech Republic & Remote",
    },
  },
  metadataBase: new URL("https://ep2024.europython.eu/"),
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
        <PlausibleProvider domain="ep2024.europython.eu" />
      </head>
      <body>{children}</body>
    </html>
  );
}
