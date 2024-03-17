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

import vercel from "@astrojs/vercel/static";

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
          behavior: "prepend",
          content() {
            return [h("span.heading-link", "#"), h("span.icon.icon-link")];
          },
        },
      ],
    ],
  },
  site: "https://ep2024.europython.eu",
  integrations: [mdx(), sitemap(), react(), tailwind(), metaTags()],
  output: "static",
  adapter: vercel(),
});
