import "../styles/main.css";
import "../styles/overrides.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";

const components = {
  h1: ({ children }: any) => <h1 style={{ color: "red" }}>🔣 {children}</h1>,
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

export default MyApp;
