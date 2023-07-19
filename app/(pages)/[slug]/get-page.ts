import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";

export const getPage = async (parts: string[], shouldSerialize = true) => {
  const part = parts.join("/");
  const markdownPath = path.join(
    process.cwd(),
    `data/pages-content/${part}.md`
  );

  const page = await fs.readFile(markdownPath);
  const { content, data } = matter(page);

  let mdxSource = null;

  if (shouldSerialize) {
    await import("lib/mdx-utils").then(async (lib) => {
      // @ts-ignore
      mdxSource = await lib.serialize(content.toString());
    });
  }

  return {
    mdxSource,
    data,
  };
};
