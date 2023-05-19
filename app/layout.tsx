import "../styles/main.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default:
      "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
    template: "%s | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
