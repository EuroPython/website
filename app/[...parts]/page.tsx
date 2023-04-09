import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import glob from "glob";

import { serialize } from "lib/mdx-utils";
import { MDXRemote } from "components/mdx-remote/mdx-remote";

export default async function Page({
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

  //   let title = title
  //     ? `${title} - EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote`
  //     : "EuroPython 2023 | July 17th-23rd 2023 | Prague, Czech Republic & Remote";

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
