import { select } from "unist-util-select";
import type { Node } from "unist";

export function makeFirstParagraphBig() {
  return transform;
}

function transform(tree: Node) {
  const paragraph = select("heading + paragraph", tree);

  if (paragraph) {
    paragraph.data = paragraph.data || {};
    // @ts-ignore
    paragraph.data.hProperties = paragraph.data.hProperties || {};
    // @ts-ignore
    (paragraph.data.hProperties as any).className = "large";
  }
}
