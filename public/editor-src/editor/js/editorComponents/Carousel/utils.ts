import { postsQuery } from "visual/utils/elements/posts";
import { CloudQuery } from "visual/utils/elements/posts/types";
import { Value } from "./types";
import { decodeV } from "./utils.common";

export function getLoopAttributes(v: Value): CloudQuery {
  const decoded = decodeV(v);

  return postsQuery(decoded);
}
