import { getCollection } from "astro:content";
import { readFileSync } from "fs";

/** Standalone .astro pages that always exist regardless of content collection */
const ALWAYS_EXIST = new Set([
  "sessions",
  "speakers",
  "schedule",
  "schedule/talks",
  "schedule/tutorials",
  "posters",
  "talks",
  "tutorials",
  "sprints",
  "jobs",
  "sponsors",
  "community-partners",
  "media-partners",
]);

/**
 * Build a link-checker function that returns `true` for URLs pointing to
 * existing pages (content collection, standalone pages, or redirect targets).
 *
 * Call once in `.astro` frontmatter, then pass the returned function to
 * any filter step.
 */
export async function buildLinkChecker(): Promise<(url: string) => boolean> {
  // Parse redirect paths from astro.config.mjs at build time
  const configText = readFileSync("astro.config.mjs", "utf-8");
  const redirectMatch = configText.match(/redirects:\s*{([^}]+)}/s);
  const redirectPathsFromConfig: string[] = redirectMatch
    ? [...redirectMatch[1].matchAll(/"([^"]+)"\s*:/g)].map((m) =>
        m[1].replace(/^\//, "").replace(/\/$/, "")
      )
    : [];

  // Build list of existing content page slugs
  const existingPages = await getCollection("pages");
  const existingSlugs = new Set(existingPages.map((p) => p.id));

  const redirectPaths = [...new Set(redirectPathsFromConfig)];

  return function linkExists(url: string): boolean {
    if (url.startsWith("http")) return true;
    const slug = url.replace(/^\//, "").replace(/\/$/, "");
    if (!slug) return true;
    if (ALWAYS_EXIST.has(slug)) return true;
    if (redirectPaths.includes(slug)) return true;
    // Check exact match in content pages
    if (existingSlugs.has(slug)) return true;
    // Check if slug is the short form of a nested page (e.g. "mentorship" from "programme/mentorship")
    for (const existing of existingSlugs) {
      if (existing.endsWith("/" + slug) || existing === slug) return true;
    }
    return false;
  };
}
