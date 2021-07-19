import _ from "underscore";
import { objectFromEntries } from "visual/utils/object";
import { Dictionary } from "visual/types/utils";
import { Migration } from "visual/utils/migration";
import * as Str from "visual/utils/reader/string";
import * as Obj from "visual/utils/reader/object";
import * as Arr from "visual/utils/reader/array";
import * as Union from "visual/utils/reader/union";

type V2 = {
  type: "posts" | "archives" | "products" | "archives-product" | "upsell";
  _styles: string[];
  source: string | undefined;
  orderBy: string | undefined;
  order: "ASC" | "DESC" | undefined;
  symbols: Dictionary<string> | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function never(_: never): never {
  throw new Error("Didn't expect to get here");
}

function determineType(v: object): V2["type"] {
  let type: V2["type"] = "posts";

  if (Obj.hasKey("type", v)) {
    const read = Union.readWithChoices<V2["type"]>([
      "posts",
      "archives",
      "products",
      "archives-product",
      "upsell"
    ])(v.type);

    if (read) {
      type = read;
    }
  } else if (Obj.hasKey("_styles", v)) {
    // try to infer type from _styles

    const styles = Arr.readWithItemReader(Str.read)(v._styles) ?? [];

    if (
      styles.includes("posts--archives") ||
      styles.includes("posts--archive") ||
      styles.includes("posts-archives") ||
      styles.includes("posts-archive")
    ) {
      type = "archives";
    } else if (styles.includes("posts--archives-product")) {
      type = "archives-product";
    }
  }

  return type;
}

function migrateSymbols(v: object, source: V2["source"]): V2["symbols"] {
  if (Obj.hasKey("taxonomy", v) && Obj.hasKey("taxonomyId", v)) {
    const taxonomy = Str.read(v.taxonomy);
    const taxonomyId = Str.read(v.taxonomyId);

    if (taxonomy && taxonomyId) {
      return {
        [`${source}_incBy`]: '["term"]',
        [`${source}_inc_term`]: `["${taxonomy}:${taxonomyId}"]`
      };
    }
  }

  return undefined;
}

function migrateOrderBy(v: object): V2["orderBy"] {
  if (Obj.hasKey("orderBy", v)) {
    const orderBy = Str.read(v.orderBy) || "id";
    return orderBy === "ID" ? "id" : orderBy;
  }

  return undefined;
}

function migrateOrder(v: object): V2["order"] {
  if (Obj.hasKey("order", v)) {
    const order =
      Union.readWithChoices<"ASC" | "asc" | "DESC" | "desc">([
        "ASC",
        "asc",
        "DESC",
        "desc"
      ])(v.order) ?? "ASC";
    return order.toUpperCase() as "ASC" | "DESC";
  }

  return undefined;
}

function removeUndefinedKeys(v: object): object {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filtered = Object.entries(v).filter(([_, val]) => val !== undefined);

  return objectFromEntries(filtered);
}

export const m2: Migration = {
  version: 2,
  cb(v) {
    if (!Obj.isObject(v)) {
      throw new Error(`Posts migration 2 input failed ${v}`);
    }

    const type = determineType(v);
    let migrated: V2 | undefined;

    switch (type) {
      case "posts": {
        const source = "post";
        migrated = {
          type,
          source,
          _styles: ["posts", "posts-posts"],
          orderBy: migrateOrderBy(v),
          order: migrateOrder(v),
          symbols: migrateSymbols(v, source)
        };
        break;
      }
      case "archives": {
        migrated = {
          type,
          source: undefined,
          _styles: ["posts", "posts-archive"],
          orderBy: "id",
          order: "DESC",
          symbols: undefined
        };
        break;
      }
      case "products": {
        const source = "product";
        migrated = {
          type,
          source,
          _styles: ["posts", "posts-products"],
          orderBy: migrateOrderBy(v),
          order: migrateOrder(v),
          symbols: migrateSymbols(v, source)
        };
        break;
      }
      case "archives-product": {
        migrated = {
          type,
          source: undefined,
          _styles: ["posts", "posts-productArchive"],
          orderBy: "id",
          order: "DESC",
          symbols: undefined
        };
        break;
      }
      case "upsell": {
        migrated = {
          type,
          source: undefined,
          _styles: ["posts", "posts-upsell"],
          orderBy: "id",
          order: "DESC",
          symbols: undefined
        };
        break;
      }
      default:
        never(type);
    }

    return removeUndefinedKeys({
      ..._.omit(v, "taxonomy", "taxonomyId", "orderBy", "order"),
      ...migrated
    });
  }
};
