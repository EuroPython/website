import path from "path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";
import deleteUnusedImages from "astro-delete-unused-images";
import { execSync } from "node:child_process";
import svelte from "@astrojs/svelte";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";

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

const fastBuild= true;

function dontDie() {
  return {
    name: "dont-die",
    hooks: {
      "astro:config:setup": () => {
        process.on("uncaughtException", (error) => {
          if (
            error.message &&
            error.message.includes("Failed to load remote image")
          ) {
            console.warn(
              "[dont-die] Caught remote image error:",
              error.message
            );
            return;
          }
        });
      },
    },
  };
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
        "@stores": path.resolve("./src/stores"),
        "@sections": path.resolve("./src/components/sections"),
        "@layouts": path.resolve("./src/layouts"),
        "@ui": path.resolve("./src/components/ui"),
        "@assets": path.resolve("./src/assets"),
        "@styles": path.resolve("./src/styles"),
        "@i18n": path.resolve("./src/i18n"),
        "@src": path.resolve("./src"),
      },
    },

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
          behavior: "wrap",
        },
      ],
    ],
    plugins: [tailwindcss()],
  },
  site: process.env.SITE_URL || "https://ep2025.europython.eu",
  redirects: {
    "/planning/": "https://forms.gle/riw6CvML8ck94A4V9",
    "/reviewers/": "https://forms.gle/4GTJjwZ1nHBGetM18",
    "/speaker/savannah-ostrowski": "/speaker/savannah-bailey",
    "/rust-summit": "/session/rust-summit",
    "/c-api-summit": "/session/c-api-summit",
    "/wasm-summit": "/session/webassembly-summit",
    "/programme/rust-summit": "/session/rust-summit",
    "/programme/c-api-summit": "/session/c-api-summit",
    "/programme/wasm-summit": "/session/webassembly-summit",
  },
  integrations: [
    mdx(),
    svelte(),
    ...(fastBuild? [] : [
      sitemap(),
      metaTags(),
      deleteUnusedImages(),
      compress({
        HTML: false,
        JavaScript: false,
        CSS: false,
        SVG: false,
      }),
      dontDie(),
    ]),
  ],
  output: "static",
  build: {
    ...(fastBuild? {} : { minify: true,}),
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    domains: ["programme.europython.eu", "placehold.co"],
  },
});
