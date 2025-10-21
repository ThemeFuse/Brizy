import {
  CURRENT_CONTEXT_TYPE,
  archiveQuery,
  postsQuery
} from "visual/utils/elements/posts/index.wp";
import { WPQuery, WPTagsQuery } from "visual/utils/elements/posts/types";
import * as Str from "visual/utils/string";
import { V } from "./types";
import { decodeV } from "./utils.common";

export function getLoopAttributes(v: V): WPQuery {
  const { gridRow, gridColumn, ...decoded } = decodeV(v);
  const isCurrentContext = v.source === CURRENT_CONTEXT_TYPE;
  const count = gridRow !== 0 && gridColumn !== 0 ? gridRow * gridColumn : -1;

  const data = {
    ...decoded,
    count
  };

  if (isCurrentContext) {
    return archiveQuery(data);
  }

  switch (v.type) {
    case "archives":
    case "archives-product":
    case "upsell":
      return archiveQuery(data);
    default:
      return postsQuery(data);
  }
}

export function getLoopTagsAttributes(v: V): WPTagsQuery | undefined {
  const { tagsSource, filterStyle, type, allTag } = v;
  const tax = Str.toString(tagsSource);
  const tag = Str.toString(allTag) ?? "";

  if (!tax || (type !== "posts" && type !== "products")) {
    return undefined;
  }

  // Need with postLoop attributes for corrections
  const { gridRow, gridColumn, ...decoded } = decodeV(v);
  const count = gridRow !== 0 && gridColumn !== 0 ? gridRow * gridColumn : -1;

  const postLoopAttribute = postsQuery({
    ...decoded,
    count
  });

  return {
    tax,
    allTag: tag,
    ulClassName: `brz-posts__filter--${filterStyle}`,
    liClassName: `brz-posts__filter__item--${filterStyle}`,
    ...postLoopAttribute
  };
}
