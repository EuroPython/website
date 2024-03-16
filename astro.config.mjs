import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "contents" }]],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
  },

  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react(), tailwind(), metaTags()]
});
