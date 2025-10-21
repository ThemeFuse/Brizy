import { CURRENT_CONTEXT_TYPE } from "visual/utils/elements/posts";
import { archiveQuery, postsQuery } from "visual/utils/elements/posts/index.wp";
import { WPQuery } from "visual/utils/elements/posts/types";
import { Value } from "./types";
import { decodeV } from "./utils.common";

export function getLoopAttributes(v: Value): WPQuery {
  const isCurrentContext = v.source === CURRENT_CONTEXT_TYPE;
  const decodedV = decodeV(v);

  if (isCurrentContext) {
    return archiveQuery(decodedV);
  }

  return postsQuery(decodedV);
}
