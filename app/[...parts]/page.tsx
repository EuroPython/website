import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";

import { serialize } from "lib/mdx-utils";
import { MDXRemote } from "components/mdx-remote/mdx-remote";

const getPage = async (parts: string[]) => {
  const pagePath = parts.join("/");

  const markdownPath = path.join(
    process.cwd(),
    `data/pages-content/${pagePath}.md`
  );

  const page = await fs.readFile(markdownPath);
  const { content, data } = matter(page);
  const mdxSource = await serialize(content.toString());

  return {
    mdxSource,
    data,
  };
};

export async function generateMetadata({
  params,
}: {
  params: { parts: string[] };
}) {
  const { data } = await getPage(params.parts);

  return {
    title: data.title,
  };
}

export default async function Page({
  params,
}: {
  params: { parts: string[] };
}) {
  const { mdxSource } = await getPage(params.parts);

  return (
    <main id="main-content" className="px-6">
      <MDXRemote {...mdxSource} />
    </main>
  );
}

// export async function getStaticPaths() {
//   const pages = glob.sync("data/pages-content/**/*.md");

//   const paths = pages.map((page) => ({
//     params: {
//       parts: page
//         .replace("data/pages-content/", "")
//         .replace(".md", "")
//         .split("/"),
//     },
//   }));

//   return { paths, fallback: false };
// }
