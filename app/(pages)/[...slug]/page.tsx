import { MDXRemote } from "components/mdx-remote/mdx-remote";
import { getPage } from "./get-page";
import { notFound } from "next/navigation";
import { glob } from "glob";

// we are not using a catch-all because of this issue:
// https://github.com/vercel/next.js/issues/48162
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  try {
    const { data } = await getPage(params.slug, false);

    return {
      title: data.title,
    };
  } catch (e) {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  try {
    const { mdxSource } = await getPage(params.slug);

    /* @ts-ignore */
    return <MDXRemote {...mdxSource} />;
  } catch (e) {
    console.error(e);

    return notFound();
  }
}

export async function generateStaticParams() {
  const pages = glob.sync("data/pages-content/**/*.md");

  return pages.map((page) => {
    const slug = page
      .replace("data/pages-content/", "")
      .replace(".md", "")
      .split("/");

    return { slug };
  });
}
