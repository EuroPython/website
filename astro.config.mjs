import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { h } from "hastscript";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
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
  integrations: [mdx(), sitemap(), react(), metaTags()],
  output: "static",
});
