import path from "path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";
import pagefind from "astro-pagefind";
import deleteUnusedImages from "astro-delete-unused-images";
import preload from "astro-preload";
import { execSync } from "node:child_process";

import compress from "astro-compress";

import svelte from "@astrojs/svelte";

let gitVersion = String(process.env.GIT_VERSION ?? "").slice(0, 7);

if (!gitVersion) {
  try {
    gitVersion = execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    gitVersion = "unknown";
  }
}

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      __TIMESTAMP__: JSON.stringify(
        new Date()
          .toISOString()
          .replace(/[-:T.Z]/g, "")
          .slice(0, 14)
      ),
      __GIT_VERSION__: JSON.stringify(gitVersion),
    },
    resolve: {
      alias: {
        "@utils": path.resolve("./src/utils"),
        "@data": path.resolve("./src/data"),
        "@components": path.resolve("./src/components"),
        "@sections": path.resolve("./src/components/sections"),
        "@layouts": path.resolve("./src/layouts"),
        "@ui": path.resolve("./src/components/ui"),
        "@assets": path.resolve("./src/assets"),
        "@styles": path.resolve("./src/styles"),
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
    "/speaker/savannah-ostrowski": "/speaker/savannah-bailey",
  },
  integrations: [
    preload(),
    mdx(),
    sitemap(),
    tailwind({
      nesting: true,
    }),
    metaTags(),
    pagefind(),
    deleteUnusedImages(),
    svelte(),
    compress(),
  ],
  output: "static",
  build: {
    minify: true,
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    domains: ["programme.europython.eu", "placehold.co"],
  },
});
