import { omit } from "es-toolkit";
import { ElementModel } from "visual/component/Elements/Types";
import { Dictionary } from "visual/types/utils";
import { Deps, Migration } from "visual/utils/migration";
import { objectFromEntries } from "visual/utils/object";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import * as Union from "visual/utils/reader/union";

type V2 = {
  source: "post" | "product";
  orderBy: string | undefined;
  order: "ASC" | "DESC" | undefined;
  symbols: Dictionary<string> | undefined;
};

function migrateSymbols(v: ElementModel, source: V2["source"]): V2["symbols"] {
  if (Obj.hasKey("taxonomy", v) && Obj.hasKey("taxonomyId", v)) {
    const taxonomy = Str.read(v.taxonomy);
    const taxonomyId = Str.read(v.taxonomyId);

    if (taxonomy && taxonomyId) {
      const [_taxonomy] = taxonomy.split("|");

      return {
        [`${source}_incBy`]: '["term"]',
        [`${source}_inc_term`]: `["${_taxonomy}:${taxonomyId}"]`
      };
    }
  }

  return undefined;
}

function migrateOrderBy(v: ElementModel): V2["orderBy"] {
  if (Obj.hasKey("orderBy", v)) {
    const orderBy = Str.read(v.orderBy) || "id";
    return orderBy === "ID" ? "id" : orderBy;
  }

  return undefined;
}

function migrateOrder(v: ElementModel): V2["order"] {
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

function removeUndefinedKeys(v: ElementModel): Record<string, unknown> {
  const filtered = Object.entries(v).filter(([, val]) => val !== undefined);

  return objectFromEntries(filtered);
}

const productPrefixes = ["product", "pa_"];

function getSource(v: ElementModel): V2["source"] {
  const source = Union.readWithChoices<V2["source"]>(["post", "product"])(
    v.source
  );

  if (source) {
    return source;
  }

  if (Obj.hasKey("taxonomy", v)) {
    const taxonomy = Str.read(v.taxonomy) ?? "";

    if (productPrefixes.some((prefix) => taxonomy.startsWith(prefix))) {
      return "product";
    }
  }

  return "post";
}

export const m2: Migration<Deps<unknown>> = {
  version: 2,
  cb(v) {
    if (!Obj.isObject(v)) {
      throw new Error(`Carousel migration 2 input failed ${v}`);
    }

    const source = getSource(v);

    const migrated: V2 = {
      source,
      orderBy: migrateOrderBy(v),
      order: migrateOrder(v),
      symbols: migrateSymbols(v, source)
    };

    return removeUndefinedKeys({
      ...omit(v, ["taxonomy", "taxonomyId", "orderBy", "order"]),
      ...migrated
    });
  }
};
