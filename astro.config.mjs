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

// https://astro.build/config
export default defineConfig({
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
    "/programme/wasm-summit/": "/programme/wasm-summit/",
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
});
