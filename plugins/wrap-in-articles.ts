import { findAfter } from "unist-util-find-after";
import { visitParents } from "unist-util-visit-parents";
import { is } from "unist-util-is";

import type { Node, Parent } from "unist";
import type { Heading } from "mdast";
import { matches } from "unist-util-select";

const isHeading = (node: Node): node is Heading => {
  return is(node, { type: "heading" });
};

export function wrapInArticles() {
  return transform;
}

const hasOnlyOneImage = (node: Node): node is Parent => {
  return (
    matches("paragraph", node) &&
    (node as Parent).children.length == 1 &&
    matches("image", (node as Parent).children[0])
  );
};

function transform(tree: Node) {
  const children = [];
  let currentArticle = null;
  let totalArticles = 0;

  for (let i = 0; i < (tree as Parent).children.length; i++) {
    const child = (tree as Parent).children[i];

    if (hasOnlyOneImage(child)) {
      currentArticle = null;
      children.push(child.children[0]);
    } else if (!currentArticle || matches("heading", child)) {
      currentArticle = {
        type: "section",
        children: [] as Node[],
        data: {
          hName: "article",
          hProperties: {
            className: totalArticles % 2 === 0 ? "accent-left" : "accent-right",
          },
        },
      };
      totalArticles += 1;
      children.push(currentArticle);
    }

    if (currentArticle) {
      currentArticle.children.push(child);
    }
  }

  (tree as Parent).children = children;
}
