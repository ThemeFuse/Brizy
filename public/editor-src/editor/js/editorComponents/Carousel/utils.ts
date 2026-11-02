import { postsQuery } from "visual/utils/elements/posts";
import type { CloudQuery } from "visual/utils/elements/posts/types";
import type { Value } from "./types";
import { decodeV } from "./utils.common";

export function getLoopAttributes(v: Value): CloudQuery {
  const decoded = decodeV(v);

  return postsQuery(decoded);
}
