import "../styles/main.css";

export const metadata = {
  title:
    "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote",
  description: "",
  alternates: [
    {
      type: "application/rss+xml",
      title: "EuroPython Blog RSS Feed",
      href: "http://blog.europython.eu/rss",
    },
  ],
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
