import path from "path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";
import pagefind from "astro-pagefind";
import deleteUnusedImages from "astro-delete-unused-images";

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      "process.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
    },
    resolve: {
      alias: {
        "@data": path.resolve("./src/data"),
        "@components": path.resolve("./src/components"),
        "@sections": path.resolve("./src/components/sections"),
        "@layouts": path.resolve("./src/layouts"),
        "@ui": path.resolve("./src/components/ui"),
        "@assets": path.resolve("./src/assets"),
        "@i18n": path.resolve("./src/i18n"),
        "@src": path.resolve("./src"),
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
          behavior: "wrap",
        },
      ],
    ],
  },
  site: process.env.SITE_URL || "https://ep2025.europython.eu",
  redirects: {
    "/planning/": "https://forms.gle/riw6CvML8ck94A4V9",
    "/reviewers/": "https://forms.gle/4GTJjwZ1nHBGetM18",
    "/programme/cfp/": "/cfp/",
    "/programme/c-api-summit/": "/c-api-summit/",
    "/programme/rust-summit/": "/rust-summit/",
    "/programme/voting/": "/voting/",
    "/programme/wasm-summit/": "/wasm-summit/",
    "/sessions/": "/sessions/",
    "/sponsor/": "/sponsorship/sponsor/",
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
    deleteUnusedImages(),
  ],
  output: "static",
  build: {
    minify: true,
  },
  experimental: {
    svg: true,
  },
});
