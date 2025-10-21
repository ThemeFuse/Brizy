import { Arr, Json, Str } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import { produce } from "immer";
import { ElementModel } from "visual/component/Elements/Types";
import { Choice } from "visual/component/Options/types/dev/Select/types";
import { isT } from "visual/utils/value";
import {
  AttributeValue,
  AttributeValueObjectValue,
  Attributes,
  PostsTypes,
  Sources
} from "./types";

export const CURRENT_CONTEXT_TYPE = "brz_current_context";
export const ORDER_BY_FIELD = "field";
export const readSymbol = mPipe(Json.read, Arr.readWithItemReader(Str.read));

export function stringifyAttributes(attributes: Attributes): string {
  return Object.entries(attributes)
    .map(stringifyAttribute)
    .filter(isT)
    .join(" ");
}

function stringifyAttribute([k, v]: [string, AttributeValue]):
  | string
  | undefined {
  if (v === undefined || v === null) {
    return undefined;
  } else if (typeof v === "string" || typeof v === "number") {
    return `${k}='${v}'`;
  } else if (Array.isArray(v) && v.length > 0) {
    const vs = v.join(",");
    return `${k}='${vs}'`;
  } else {
    const vs = Object.entries(v)
      .map(stringifyAttributeValueObject)
      .filter((s) => s.length > 0)
      .join("&");

    return vs.length > 0 ? `${k}='${vs}'` : undefined;
  }
}

function stringifyAttributeValueObject([k, v]: [
  string,
  AttributeValueObjectValue
]): string {
  if (v === null || v === undefined) {
    return "";
  }

  if (typeof v === "string" || typeof v === "number") {
    return `${k}=${v}`;
  }

  if (Array.isArray(v) || typeof v === "object") {
    return Object.entries(v)
      .map(([kv, vv]) => stringifyAttributeValueObject([`${k}[${kv}]`, vv]))
      .filter((s) => s.length > 0)
      .join("&");
  }

  throw new Error("can't stringify v: " + v);
}

export function getLoopName(type: PostsTypes): string {
  switch (type) {
    case "upsell": {
      return "editor_product_upsells";
    }
    case "archives":
    case "archives-product":
    case "products":
    case "posts": {
      return "brizy_dc_post_loop";
    }
  }
}

interface WithSymbols extends ElementModel {
  symbols?: Record<string, unknown>;
}

export function decodeSymbols<V extends WithSymbols>(v: V): V {
  const symbols = v.symbols;

  return symbols && Object.keys(symbols).length > 0
    ? {
        ...v,
        ...Object.fromEntries(
          Object.entries(symbols).map(([k, val]) => [`symbol_${k}`, val])
        )
      }
    : v;
}

export function encodeSymbols<V extends WithSymbols>(v: V): V {
  return produce(v, (draft: V) => {
    for (const [key, value] of Object.entries(draft)) {
      if (key.startsWith("symbol_")) {
        draft.symbols = draft.symbols || {};
        draft.symbols[key.replace("symbol_", "")] = Str.read(value);
        delete draft[key as keyof V];
      }
    }
  });
}

export const orderByConverter = (
  selectedSource: string | null | undefined,
  sourcesArr: Sources[]
): Choice[] =>
  sourcesArr
    .find((item) => item.id === selectedSource)
    ?.orderBy.map((orderByItem) => ({
      value: orderByItem.id,
      title: orderByItem.title
    })) ?? [];

export const fieldConverter = (
  selectedSource: string | null | undefined,
  sourcesArr: Sources[]
): Choice[] => sourcesArr.find((item) => item.id === selectedSource)?.fields ?? [];
