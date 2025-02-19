import {
  styleBorderColor,
  styleBorderWidthGrouped,
  styleColor
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import * as Num from "../reader/number";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";
import { getSize } from "./cssStyleSize";

type Size = "small" | "medium" | "large" | "custom";

export function cssStyleStroke({
  v,
  device,
  state,
  store,
  prefix = "strokeColor"
}: CSSValue): string {
  const stroke = styleColor({ v, device, state, store, prefix });

  return stroke === undefined ? "" : `stroke:${stroke};`;
}

export function cssStyleStrokeWidth({
  v,
  device,
  prefix = ""
}: CSSValue): string {
  const getStrokeWidth = (size: Size, customSize: number): number => {
    switch (size) {
      case "small":
      case "medium":
        return 1;
      case "large":
        return 1.1;

      case "custom":
        return customSize <= 24
          ? 1
          : customSize > 24 && customSize <= 32
            ? 1.1
            : customSize > 32 && customSize <= 48
              ? 1.4
              : customSize > 48 && customSize <= 64
                ? 2.3
                : customSize > 64
                  ? 3
                  : 1;
    }
  };

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const customSize = Num.read(dvv(capByPrefix(prefix, "customSize")));
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const type = dvv(capByPrefix(prefix, "type"));

  if (type === "outline" && customSize && size) {
    return `stroke-width: ${getStrokeWidth(size, customSize)};`;
  }

  return "stroke-width: 1;";
}

export function cssStyleStrokeText({
  v,
  device,
  state,
  store,
  prefix = "textStroke"
}: CSSValue): string {
  const borderStrokeWidth = styleBorderWidthGrouped({
    v,
    device,
    state,
    prefix
  });

  const borderStrokeColor = styleBorderColor({
    v,
    device,
    state,
    store,
    prefix
  });

  return borderStrokeWidth === undefined || borderStrokeColor === undefined
    ? ""
    : `text-stroke: ${borderStrokeColor} ${borderStrokeWidth}px; -webkit-text-stroke:${borderStrokeColor} ${borderStrokeWidth}px;`;
}
