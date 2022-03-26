import "../styles/main.css";
import "../styles/overrides.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { components } from "../components/mdx";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

export default MyApp;
