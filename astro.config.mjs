import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { h } from "hastscript";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";
import pagefind from "astro-pagefind";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // @type-check enabled!

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      "process.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
    },
    resolve: {
      alias: {
        $: path.resolve(__dirname, "./src"),
      },
    },
  },
  markdown: {
    remarkPlugins: [
      [
        remarkToc,
        {
          heading: "contents",
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          content() {
            return [h("span.heading-link", "#")];
          },
        },
      ],
    ],
  },
  site: "https://ep2025.europython.eu",
  redirects: {
    "/c-api-summit/": "/programme/c-api-summit/",
    "/programme/cfp/": "/programme/cfp/",
    "/planning/": "https://forms.gle/riw6CvML8ck94A4V9",
    "/reviewers/": "https://forms.gle/4GTJjwZ1nHBGetM18",
    "/rust-summit/": "/programme/rust-summit/",
    "/sponsor/": "/sponsorship/sponsor/",
    "/voting/": "/programme/voting/",
    "/wasm-summit/": "/programme/wasm-summit/",
  },
  integrations: [
    mdx(),
    sitemap(),
    react(),
    tailwind({
      nesting: true,
    }),
    metaTags(),
    pagefind(),
  ],
  output: "static",
  build: {
    minify: true,
  },
});
