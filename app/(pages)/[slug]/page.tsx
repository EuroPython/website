import { MDXRemote } from "components/mdx-remote/mdx-remote";
import { getPage } from "./get-page";
import { notFound } from "next/navigation";

// we are not using a catch-all because of this issue:
// https://github.com/vercel/next.js/issues/48162
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { data } = await getPage([params.slug], false);

    return {
      title: data.title,
    };
  } catch (e) {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const { mdxSource } = await getPage([params.slug]);

    /* @ts-ignore */
    return <MDXRemote {...mdxSource} />;
  } catch (e) {
    console.error(e);

    return notFound();
  }
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
