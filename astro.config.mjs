import path from "path";
import { loadEnv } from "vite";
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
import pagefind from "astro-pagefind";

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

const mode =
  process.argv.find((arg) =>
    ["development", "production", "preview"].includes(arg)
  ) || "production";
const fastBuild = loadEnv(mode, process.cwd(), "").EP_FAST_BUILD === "true";
console.log(
  `\x1b[35m[EP]\x1b[0m Fast Build: \x1b[1m\x1b[34m${fastBuild}\x1b[0m`
);

import fs from "fs";
import p from "path";

function syncKeynoterImages() {
  const srcDir = "src/content/keynoters";
  const destDir = "public/content/keynoters";

  function sync() {
    if (!fs.existsSync(srcDir)) return;
    fs.mkdirSync(destDir, { recursive: true });
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) continue;
      fs.cpSync(p.join(srcDir, entry.name), p.join(destDir, entry.name), {
        force: true,
      });
    }
  }

  function cleanStale() {
    if (!fs.existsSync(destDir)) return;
    for (const entry of fs.readdirSync(destDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!fs.existsSync(p.join(srcDir, entry.name))) {
        fs.unlinkSync(p.join(destDir, entry.name));
      }
    }
  }

  return {
    name: "sync-keynoter-images",
    buildStart() {
      sync();
      cleanStale();
    },
  };
}

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
        "@content": path.resolve("./src/content"),
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

    plugins: [tailwindcss(), syncKeynoterImages()],
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
  site: process.env.SITE_URL || "https://ep2026.europython.eu",
  redirects: {
    // "/planning/": "https://forms.gle/riw6CvML8ck94A4V9",
    // "/reviewers/": "https://forms.gle/4GTJjwZ1nHBGetM18",
    "/packaging-summit": "/session/packaging-summit",
    "/rust-summit": "/session/rust-summit-at-europython",
    "/session/rust-summit": "/session/rust-summit-at-europython",
    "/25anniversary": "https://forms.gle/X4vCPsmHy95s5S9Y8",
    "/discord": "https://discord.gg/pbbBHS4E45",
    // "/c-api-summit": "/session/c-api-summit",
    // "/wasm-summit": "/session/webassembly-summit",
    // "/programme/c-api-summit": "/session/c-api-summit",
    // "/programme/wasm-summit": "/session/webassembly-summit",
    // "/discord": "https://discord.gg/BhTN2zJPMh",
    // For AV team internal use: break screens
    // "/break/forum-hall":
    //   "https://overlays.gbdl.in/ep-forum-hall/scene-schedule.html",
    // "/break/north-hall":
    //   "https://overlays.gbdl.in/ep-north-hall/scene-schedule.html",
    // "/break/south-hall-2a":
    //   "https://overlays.gbdl.in/ep-south-hall-2a/scene-schedule.html",
    // "/break/south-hall-2b":
    //   "https://overlays.gbdl.in/ep-south-hall-2b/scene-schedule.html",
    // "/break/terrace-2a":
    //   "https://overlays.gbdl.in/ep-terrace-2a/scene-schedule.html",
    // "/break/terrace-2b":
    //   "https://overlays.gbdl.in/ep-terrace-2b/scene-schedule.html",
    // // For AV team internal use: VDO ninja screen share
    // "/ninja/forum-hall":
    //   "https://vdo.ninja/?room=EuroPython_2025_Forum_Hall&hash=338a&do",
    // "/ninja/north-hall":
    //   "https://vdo.ninja/?room=EuroPython_2025_North_Hall&hash=338a&do",
    // "/ninja/south-hall-2a":
    //   "https://vdo.ninja/?room=EuroPython_2025_Southhall_2A&hash=338a&do",
    // "/ninja/south-hall-2b":
    //   "https://vdo.ninja/?room=EuroPython_2025_Southhall_2B&hash=338a&do",
    // "/ninja/terrace-2a":
    //   "https://vdo.ninja/?room=EuroPython_2025_Terrace_2A&hash=338a&do",
    // "/ninja/terrace-2b":
    //   "https://vdo.ninja/?room=EuroPython_2025_Terrace_2B&hash=338a&do",
  },
  integrations: [
    pagefind({
      indexConfig: {
        // Skip media pages from search results
        excludeSelectors: ["html[data-pagefind-ignore]"],
      },
    }),
    mdx(),
    svelte(),
    ...(fastBuild
      ? []
      : [
          sitemap(),
          metaTags(),
          deleteUnusedImages(),
          compress({
            HTML: false,
            CSS: false,
            SVG: false,
          }),
          dontDie(),
        ]),
  ],
  output: "static",
  build: {
    ...(fastBuild ? {} : { minify: true }),
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    domains: ["programme.europython.eu", "placehold.co"],
  },
  prefetch: {
    prefetchAll: false,
  },
  devToolbar: {
    enabled: false,
  },
});
