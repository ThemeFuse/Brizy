/* eslint-disable @typescript-eslint/no-use-before-define */
import { ECWID_CATEGORY_TYPE, ECWID_PRODUCT_TYPE } from "visual/utils/ecwid";
import { readSymbol } from "visual/utils/elements/posts";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { V, VDecoded } from "./types";

export function decodeV(v: V): VDecoded {
  const {
    type,
    gridRow,
    gridColumn,
    source,
    component: _component,
    querySource,
    offset,
    orderBy,
    order,
    symbols,
    excludeCurrentProduct,
    excludeCurrentProductOption,
    field
  } = v;

  const component = Str.read(_component);

  return {
    type: Str.read(type) ?? "",
    gridRow: Num.read(gridRow) ?? 1,
    gridColumn: Num.read(gridColumn) ?? 1,
    source: Str.read(source) ?? "",
    querySource: Str.read(querySource) ?? "",
    offset: Num.read(offset) ?? 0,
    orderBy: Str.read(orderBy) ?? "",
    order: Str.read(order) ?? "",
    symbols: Obj.readWithValueReader(readSymbol)(symbols) ?? {},
    ...(component ? { component } : {}),
    ...(excludeCurrentProduct === "on" ? { excludeCurrentProduct } : {}),
    ...(excludeCurrentProductOption ? { excludeCurrentProductOption } : {}),
    ...(field ? { field } : {})

    // NOTE: left for until will work on single refs
    // symbols:
    //   Obj.readWithValueReader(
    //     value =>
    //       readSymbol(value) ??
    //       Str.read(value)
    //   )(symbols) ?? {}
  };
}

export const getPlaceholderIcon = (component: string): string => {
  switch (component) {
    case ECWID_PRODUCT_TYPE:
    case ECWID_CATEGORY_TYPE:
      return "ecwid-product-placeholder";
    default:
      return "posts";
  }
};

export const getPlaceholderClassName = (component: string): string => {
  switch (component) {
    case ECWID_PRODUCT_TYPE:
    case ECWID_CATEGORY_TYPE:
      return "brz-ecwid-product-placeholder";
    default:
      return "";
  }
};
