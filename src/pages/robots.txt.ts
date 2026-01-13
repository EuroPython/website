import type { APIRoute } from "astro";

const previewRobots = `
User-agent: *
Disallow: /
`;

const prodRobots = `
User-agent: *
Disallow: /_astro/
Disallow: /media/
Disallow: /*?
Allow: /

Sitemap: https://ep2026.europython.eu/sitemap-index.xml
`;

const isPreview = import.meta.env.MODE == "preview";
export const GET: APIRoute = () =>
  new Response(isPreview ? previewRobots : prodRobots);
