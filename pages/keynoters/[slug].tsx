import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import matter from "gray-matter";
import { promises as fs } from "fs";
import path from "path";
import { Layout } from "../../components/layout";
import { wrapInArticles } from "../../plugins/wrap-in-articles";
import { highlightFirstHeading } from "../../plugins/highlight-first-heading";
import { components } from "../../components/mdx";
import keynoters from "../../data/keynoters.json";
import { Title } from "components/typography/title";
import { Prose } from "components/prose/prose";
import { serialize } from "next-mdx-remote/serialize";

const findKeynoter = (name: string) => {
  return keynoters.find((keynoter) => keynoter.name === name);
};

// TODO: move to /app

export default function Page({
  source,
  path,
  bioSource,
  slug,
  data: { title, speaker, affiliation },
}: {
  source: any;
  bioSource: any;
  path: string;
  slug: string;
  data: {
    title: string;
    speaker: string;
    affiliation?: string;
  };
}) {
  const keynoter = findKeynoter(speaker)!;
  const socialCardUrl = `https://ep2023.europython.eu/api/social-cards/?keynoter=${slug}&v2`;

  return (
    <Layout
      path={path}
      title={`${title} || EuroPython 2023`}
      socialCardUrl={socialCardUrl}
    >
      <main id="main-content" className="px-6">
        <Title level={2}>{title}</Title>
        <Title level={3}>
          <a href="#about">{keynoter.name}</a>
        </Title>

        <Prose>
          <MDXRemote {...source} components={components} />
        </Prose>

        <div id="about">
          <Title level={2}>About the keynoter</Title>
          <div>
            <div>
              <img src={keynoter.picture} className="w-full max-w-sm mb-12" />
            </div>

            <div>
              {affiliation ? <div>Affiliation: {affiliation}</div> : null}

              <Prose>
                <MDXRemote {...bioSource} components={components} />
              </Prose>
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
  return { paths, fallback: "blocking" };
}

async function serializeWithPlugins(content: string, plugins: any[]) {
  return await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        // @ts-ignore
        rehypeSlug,
        // @ts-ignore
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        // @ts-ignore
        [rehypeExternalLinks, { rel: ["nofollow"] }],
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
    props: {
      source: mdxSource,
      path: pagePath,
      data,
      bioSource,
      slug: params.slug,
    },
    revalidate: 60,
  };
}
