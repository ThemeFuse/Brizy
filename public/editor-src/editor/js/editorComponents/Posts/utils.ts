/* eslint-disable @typescript-eslint/no-use-before-define */
import { archiveQuery, postsQuery } from "visual/utils/elements/posts";
import { CloudQuery } from "visual/utils/elements/posts/types";
import { CloudTagsQuery, V } from "./types";
import { decodeV } from "./utils.common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getLoopTagsAttributes(_v: V): undefined | CloudTagsQuery {
  return undefined;
}

export function getLoopAttributes(v: V): CloudQuery {
  const { gridRow, gridColumn, ...decoded } = decodeV(v);
  const data = {
    ...decoded,
    count: gridRow * gridColumn
  };

  switch (decoded.type) {
    case "archives":
      return archiveQuery(data);
    default:
      return postsQuery(data);
  }
}
