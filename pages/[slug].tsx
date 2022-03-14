import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { wrapInArticles } from "../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../plugins/highlight-first-heading";
import { makeFirstParagraphBig } from "../plugins/make-first-paragraph-big";

export default function Page({ source }: { source: any }) {
  return (
    <Layout>
      <MDXRemote {...source} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const pages = (await fs.readdir(path.join(process.cwd(), "data"))).filter(
    (p) => p.endsWith(".md")
  );
  const paths = pages.map((page) => ({
    params: { slug: page.replace(".md", "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const faqPath = path.join(process.cwd(), `data/${params.slug}.md`);

  const content = await fs.readFile(faqPath);
  const mdxSource = await serialize(content.toString(), {
    mdxOptions: {
      remarkPlugins: [
        wrapInArticles,
        highlightFirstHeading,
        // disabled for now, because it makes text too big
        // makeFirstParagraphBig,
      ],
    },
  });
  return { props: { source: mdxSource } };
}
