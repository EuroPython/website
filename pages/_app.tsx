import "../styles/main.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { components } from "../components/mdx";
import PlausibleProvider from "next-plausible";

import dynamic from "next/dynamic";

const Tweaks = dynamic(() => import("../components/tweaks"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="ep2023.europython.eu">
      <MDXProvider components={components}>
        <Tweaks />
        <Component {...pageProps} />
      </MDXProvider>
    </PlausibleProvider>
  );
}

export default MyApp;
