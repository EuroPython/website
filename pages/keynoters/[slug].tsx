import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../../components/layout";
import { wrapInArticles } from "../../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../../plugins/highlight-first-heading";
import { components } from "../../components/mdx";
import keynoters from "../../data/keynoters.json";

const findKeynoter = (name: string) => {
  return keynoters.find((keynoter) => keynoter.name === name);
};

export default function Page({
  source,
  path,
  bioSource,
  data: { title, speaker },
}: {
  source: any;
  bioSource: any;
  path: string;
  data: {
    title: string;
    speaker: string;
  };
}) {
  const keynoter = findKeynoter(speaker)!;

  return (
    <Layout path={path} title={`${title} || EuroPython 2022`}>
      <main id="main-content">
        <h1 className="h2">{title}</h1>
        <h2 className="h3">
          <a href="#about">{keynoter.name}</a>
        </h2>
        <MDXRemote {...source} components={components} />
        <div className="speaker-about" id="about">
          <h2>About the keynoter</h2>
          <div className="speaker-about-content">
            <div>
              <img src={keynoter.picture} />
            </div>

            <div>
              <MDXRemote {...bioSource} components={components} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const pages = (
    await fs.readdir(path.join(process.cwd(), "data/keynoters"))
  ).filter((p) => p.endsWith(".md"));
  const paths = pages.map((page) => ({
    params: { slug: page.replace(".md", "") },
  }));
  return { paths, fallback: false };
}

async function serializeWithPlugins(content: string, plugins: any[]) {
  return await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        // @ts-ignore
        rehypeSlug,
        // @ts-ignore
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
      remarkPlugins: plugins,
    },
  });
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const pagePath = `keynoters/${params.slug}`;

  const markdownPath = path.join(process.cwd(), `data/${pagePath}.md`);

  const page = await fs.readFile(markdownPath);
  const { content, data } = matter(page);

  const mdxSource = await serializeWithPlugins(content.toString(), [
    wrapInArticles,
    highlightFirstHeading,
  ]);
  const bioSource = await serializeWithPlugins(data.bio, []);

  return {
    props: { source: mdxSource, path: pagePath, data, bioSource },
  };
}
