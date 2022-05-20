import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import glob from "glob";
import { Layout } from "../components/layout";
import { wrapInArticles } from "../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../plugins/highlight-first-heading";
import { makeFirstParagraphBig } from "../plugins/make-first-paragraph-big";
import { components } from "../components/mdx";
import { inspect } from "util";

export default function Page({
  source,
  title,
  path,
}: {
  title: string;
  source: any;
  path: string;
}) {
  title = title
    ? `${title} - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote`
    : "EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote";

  return (
    <Layout path={path} title={title}>
      <main id="main-content">
        <MDXRemote {...source} components={components} />
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const pages = glob.sync("data/pages-content/**/*.md");

  const paths = pages.map((page) => ({
    params: {
      parts: page
        .replace("data/pages-content/", "")
        .replace(".md", "")
        .split("/"),
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: { parts: string[] };
}) {
  const pagePath = params.parts.join("/");

  const markdownPath = path.join(
    process.cwd(),
    `data/pages-content/${pagePath}.md`
  );

  const page = await fs.readFile(markdownPath);
  const { content, data } = matter(page);
  const mdxSource = await serialize(content.toString(), {
    mdxOptions: {
      rehypePlugins: [
        // @ts-ignore
        rehypeSlug,
        // @ts-ignore
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
      remarkPlugins: [
        wrapInArticles,
        highlightFirstHeading,
        // disabled for now, because it makes text too big
        // makeFirstParagraphBig,
      ],
    },
  });
  return {
    props: { source: mdxSource, path: pagePath, title: data.title || "" },
  };
}
