import { select } from "unist-util-select";
import type { Node } from "unist";

export function highlightFirstHeading() {
  return transform;
}

function transform(tree: Node) {
  const heading = select("heading", tree);

  if (heading) {
    heading.data = heading.data || {};
    heading.data.hProperties = heading.data.hProperties || {};
    (heading.data.hProperties as any).className = "highlighted";
  }
}
