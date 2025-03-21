/* eslint-disable @typescript-eslint/no-use-before-define */
import { Dictionary } from "visual/types/utils";
import * as Union from "visual/utils/reader/union";
import { getFieldIdCollectionId } from "./toolbarExtendParent/utils";
import {
  CloudArchiveQuery,
  CloudPostsQuery,
  CloudQuery,
  CloudTagsQuery,
  V,
  VDecoded
} from "./types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "./utils.common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getLoopTagsAttributes(_v: V): undefined | CloudTagsQuery {
  return undefined;
}

export function getLoopAttributes(v: V): CloudQuery {
  switch (v.type) {
    case "archives":
      return archiveQuery(v);
    default:
      return postsQuery(v);
  }
}

export function archiveQuery(v: V): CloudArchiveQuery {
  const { gridRow, gridColumn, orderBy, order, offset } = decodeV(v);

  return {
    type: "archive",
    count: gridRow * gridColumn,
    order_by:
      Union.readWithChoices<CloudArchiveQuery["order_by"]>([
        "id",
        "random",
        "title",
        "publishDate"
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudArchiveQuery["order"]>(["ASC", "DESC"])(
        order
      ) ?? "DESC",
    offset
  };
}

export function postsQuery(v: V): CloudPostsQuery {
  const {
    source,
    querySource,
    gridRow,
    gridColumn,
    offset,
    orderBy,
    order,
    symbols,
    excludeCurrentProduct,
    component
  } = decodeV(v);

  const includeSymbols = symbols[`${source}_incBy`];
  const include = includeSymbols
    ? includeExcludeAttribute(symbols, "inc", source, includeSymbols)
    : {};
  const isCurrentContext = source === CURRENT_CONTEXT_TYPE;

  const excludeSymbols = symbols[`${source}_excBy`];
  const exclude = excludeSymbols
    ? includeExcludeAttribute(symbols, "exc", source, excludeSymbols)
    : {};

  return {
    type: "posts",
    collection_type: source,
    collection_type_query: isCurrentContext ? querySource : undefined,
    include,
    exclude,
    count: gridRow * gridColumn,
    order_by:
      Union.readWithChoices<CloudPostsQuery["order_by"]>([
        "id",
        "random",
        "title",
        "publishDate"
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudPostsQuery["order"]>(["ASC", "DESC"])(order) ??
      "DESC",
    offset,
    ...(excludeCurrentProduct === "on" ? { excludeCurrentProduct: 1 } : {}),
    ...(component ? { component } : {})
  };
}

const includeExcludeAttribute: (
  symbols: VDecoded["symbols"],
  prefix: string,
  lvl1Id: string,
  arr: string[]
) => Dictionary<Array<{ collectionId: string; fieldId?: string }>> = (
  symbols,
  prefix,
  lvl1Id,
  arr
) =>
  arr.reduce<Dictionary<Array<{ collectionId: string; fieldId?: string }>>>(
    (acc, id) => {
      const lvl2Id = `${lvl1Id}_${prefix}_${id}`;
      const lvl2Symbol = symbols[lvl2Id];

      if (lvl2Symbol !== undefined) {
        const { collectionId } = getFieldIdCollectionId(id);
        acc[collectionId] = lvl2Symbol.map(getFieldIdCollectionId);
      }

      return acc;
    },
    {}
  );
