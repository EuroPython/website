import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";

export default function IndexPage({ source }: { source: any }) {
  return (
    <Layout>
      <MDXRemote {...source} />
    </Layout>
  );
}

export async function getStaticProps() {
  const faqPath = path.join(process.cwd(), "data/faq.md");

  const content = await fs.readFile(faqPath);
  const mdxSource = await serialize(content.toString());
  return { props: { source: mdxSource } };
}
