import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../components/layout";
import { wrapInArticles } from "../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../plugins/highlight-first-heading";
import { makeFirstParagraphBig } from "../plugins/make-first-paragraph-big";
import { Map } from "../components/map";
import Image from "next/image";

const components = {
  Map,
  img: ({ src, alt, ...props }: any) => (
    <figure className="next-image">
      <Image src={src} alt={alt} {...props} layout="fill" objectFit="contain" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),
};

export default function Page({ source }: { source: any }) {
  return (
    <Layout>
      <main id="main-content">
        <MDXRemote {...source} components={components} />
      </main>
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
      // @ts-ignore
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
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
