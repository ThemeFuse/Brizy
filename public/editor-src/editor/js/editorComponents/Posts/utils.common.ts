/* eslint-disable @typescript-eslint/no-use-before-define */

import produce from "immer";
import * as Str from "visual/utils/reader/string";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Arr from "visual/utils/reader/array";
import * as Json from "visual/utils/reader/json";
import { isT } from "visual/utils/value";
import {
  Attributes,
  AttributeValue,
  AttributeValueObjectValue,
  V,
  VDecoded
} from "./types";
import { mPipe } from "visual/utils/fp/mPipe";
import { objectFromEntries } from "visual/utils/object";

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
  } else {
    const vs = Object.entries(v)
      .map(stringifyAttributeValueObject)
      .filter(s => s.length > 0)
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
      .filter(s => s.length > 0)
      .join("&");
  }

  throw new Error("can't stringify v: " + v);
}

const readSymbol = mPipe(Json.read, Arr.readWithItemReader(Str.read));

export function decodeV(v: V): VDecoded {
  const {
    type,
    gridRow,
    gridColumn,
    source,
    offset,
    orderBy,
    order,
    symbols
  } = v;

  return {
    type: Str.read(type) ?? "",
    gridRow: Num.read(gridRow) ?? 1,
    gridColumn: Num.read(gridColumn) ?? 1,
    source: Str.read(source) ?? "",
    offset: Num.read(offset) ?? 0,
    orderBy: Str.read(orderBy) ?? "",
    order: Str.read(order) ?? "",
    symbols: Obj.readWithValueReader(readSymbol)(symbols) ?? {}

    // NOTE: left for until will work on single refs
    // symbols:
    //   Obj.readWithValueReader(
    //     value =>
    //       readSymbol(value) ??
    //       Str.read(value)
    //   )(symbols) ?? {}
  };
}

export function symbolsToV(v: V): V {
  const symbols = v.symbols;

  return symbols && Object.keys(symbols).length > 0
    ? {
        ...v,
        ...objectFromEntries(
          Object.entries(symbols).map(([k, v]) => [`symbol_${k}`, v])
        )
      }
    : v;
}

export function vToSymbols(v: V): V {
  return produce(v, draft => {
    for (const [key, value] of Object.entries(draft)) {
      if (key.startsWith("symbol_")) {
        draft.symbols = draft.symbols || {};

        draft.symbols[key.replace("symbol_", "")] = Str.read(value);
        delete draft[key as keyof V];
      }
    }
  });
}
