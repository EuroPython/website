import type { APIRoute } from "astro";

const previewRobots = `
User-agent: LinkedInBot
Allow: /

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

const envMode = import.meta.env?.MODE ?? "production";
const isPreview = envMode == "preview";
export const GET: APIRoute = () =>
  new Response(isPreview ? previewRobots : prodRobots);
