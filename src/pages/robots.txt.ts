import type { APIRoute } from "astro";

const previewRobots = `
User-agent: *
Disallow: /
`;

const prodRobots = `
User-agent: *
Disallow: /_astro/
Disallow: /*?
Allow: /

Sitemap: https://ep2025.europython.eu/sitemap-index.xml
`;

const isPreview = String(import.meta.env.PREVIEW).toLowerCase() === "true";
export const GET: APIRoute = () =>
  new Response(isPreview ? previewRobots : prodRobots);
