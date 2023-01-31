import "../styles/main.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { components } from "../components/mdx";
import { Analytics } from "@vercel/analytics/react";

import dynamic from "next/dynamic";

const Tweaks = dynamic(() => import("../components/tweaks"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Tweaks />
      <Component {...pageProps} />
      <Analytics />
    </MDXProvider>
  );
}

export default MyApp;
