import { MDXRemote } from "next-mdx-remote";

import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import glob from "glob";
import { Layout } from "../components/layout";
import { components } from "../components/mdx";
import { serialize } from "lib/mdx-utils";

export default function Page({
  source,
  title,
  path,
}: {
  title: string;
  source: any;
  className?: string;
  path: string;
}) {
  title = title
    ? `${title} - EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote`
    : "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote";

  return (
    <Layout path={path} title={title}>
      <main id="main-content" className="px-6">
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
  const mdxSource = await serialize(content.toString());
  return {
    props: {
      source: mdxSource,
      path: pagePath,
      title: data.title || "",
      className: data.class || null,
    },
  };
}
