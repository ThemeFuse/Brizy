/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { Dictionary } from "visual/types/utils";
import * as Union from "visual/utils/reader/union";
import { decodeV } from "./utils.common";
import {
  V,
  VDecoded,
  CloudQuery,
  CloudPostsQuery,
  CloudArchiveQuery
} from "./types";

export function getLoopAttributes(v: V): CloudQuery {
  switch (v.type) {
    case "archives":
      return archiveQuery(v);
    default:
      return postsQuery(v);
  }
}

export function archiveQuery(v: V): CloudArchiveQuery {
  const { gridRow, gridColumn, orderBy, order } = decodeV(v);

  return {
    type: "archive",
    count: gridRow * gridColumn,
    order_by:
      Union.readWithChoices<CloudArchiveQuery["order_by"]>([
        "id",
        "random",
        "title"
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudArchiveQuery["order"]>(["ASC", "DESC"])(
        order
      ) ?? "DESC"
  };
}

export function postsQuery(v: V): CloudPostsQuery {
  const {
    source,
    gridRow,
    gridColumn,
    offset,
    orderBy,
    order,
    symbols
  } = decodeV(v);

  const includeSymbols = symbols[`${source}_incBy`];
  const include = includeSymbols
    ? includeExcludeAttribute(symbols, "inc", source, includeSymbols)
    : {};

  const excludeSymbols = symbols[`${source}_excBy`];
  const exclude = excludeSymbols
    ? includeExcludeAttribute(symbols, "exc", source, excludeSymbols)
    : {};

  return {
    type: "posts",
    collection_type: source,
    include,
    exclude,
    count: gridRow * gridColumn,
    order_by:
      Union.readWithChoices<CloudPostsQuery["order_by"]>([
        "id",
        "random",
        "title"
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudPostsQuery["order"]>(["ASC", "DESC"])(order) ??
      "DESC",
    offset
  };
}

const includeExcludeAttribute: (
  symbols: VDecoded["symbols"],
  prefix: string,
  lvl1Id: string,
  arr: string[]
) => Dictionary<string[]> = (symbols, prefix, lvl1Id, arr) =>
  arr.reduce<Dictionary<string[]>>((acc, id) => {
    const lvl2Id = `${lvl1Id}_${prefix}_${id}`;
    const lvl2Symbol = symbols[lvl2Id];

    if (lvl2Symbol !== undefined) {
      acc[id] = lvl2Symbol;
    }

    return acc;
  }, {});
