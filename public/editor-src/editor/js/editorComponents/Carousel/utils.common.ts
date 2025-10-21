import { setIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import { readSymbol } from "visual/utils/elements/posts";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { VDecoded, Value } from "./types";

export const TYPE = "posts";

// Disabled Sortable for inactive SlideItem
export const setDataSortable = (slider: HTMLElement | null) => {
  if (!slider) {
    return;
  }

  const slides = slider.querySelectorAll<HTMLElement>(".slick-slide");
  slides.forEach((node) => {
    const ariaHidden = node.getAttribute("aria-hidden");
    if (ariaHidden !== null) {
      node.dataset.sortableDisabled = ariaHidden;
    }
  });
};

// Normalize Columns Width
export const normalizeCarouselColumns = (columns: ElementModel[]) => {
  return columns.map((column) => setIn(column, ["value", "width"], 100));
};

export function decodeV(v: Value): VDecoded {
  const { source, querySource, offset, orderBy, order, symbols, count, field } = v;

  return {
    type: TYPE,
    source: Str.read(source) ?? "",
    querySource: Str.read(querySource) ?? "",
    offset: Num.read(offset) ?? 0,
    orderBy: Str.read(orderBy) ?? "",
    order: Str.read(order) ?? "",
    symbols: Obj.readWithValueReader(readSymbol)(symbols) ?? {},
    count: Num.read(count) ?? 0,
    field: Str.read(field) ?? ""
  };
}
