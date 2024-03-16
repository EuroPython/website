import { serialize as mdxSerialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkComment from "remark-comment";
import { wrapInArticles } from "../../old/plugins/wrap-in-articles";
import { highlightFirstHeading } from "../../old/plugins/highlight-first-heading";
// import { makeFirstParagraphBig } from "../plugins/make-first-paragraph-big";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

export async function serialize(source: string, options?: any) {
  source = (source ?? "").replace(/<3/g, "❤️");

  options = options ?? {
    mdxOptions: {
      rehypePlugins: [
        // @ts-ignore
        rehypeSlug,
        // @ts-ignore
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        // @ts-ignore
        [rehypeExternalLinks, { rel: ["nofollow"], target: "_blank" }],
      ],
      remarkPlugins: [
        remarkGfm,
        wrapInArticles,
        highlightFirstHeading,
        remarkComment,
        remarkMdxDisableExplicitJsx,
        // disabled for now, because it makes text too big
        // makeFirstParagraphBig,
      ],
    },
  };

  return await mdxSerialize(source, options);
}
