import {
  styleBorderWidthUngrouped,
  styleBorderStyle,
  styleBorderColor
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";
import { Reader } from "../reader/types";

type lineHorizontalAlign = "right" | "left" | "center";

const readLineAlign: Reader<lineHorizontalAlign> = v => {
  switch (v) {
    case "right":
      return v;
    case "left":
      return v;
    case "center":
      return v;
    default:
      return undefined;
  }
};

export function cssStyleElementLineBorder({
  v,
  device,
  state
}: CSSValue): string {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    current: "top"
  });
  const borderStyle = styleBorderStyle({ v, device, state });
  const borderColor = styleBorderColor({ v, device, state });

  return borderWidth === undefined
    ? ""
    : `border-top:${borderWidth}px ${borderStyle} ${borderColor};`;
}

export function cssStyleElementLineSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const spacing = dvv("spacing");
  const spacingSuffix = dvv("spacingSuffix");
  const horizontalAlign = readLineAlign(dvv("horizontalAlign"));

  switch (horizontalAlign) {
    case "left":
      return `margin: 0 ${spacing}${spacingSuffix} 0 0;`;
    case "right":
      return `margin: 0 0 0 ${spacing}${spacingSuffix};`;
    case "center":
    case undefined:
      return `margin: 0 ${spacing}${spacingSuffix};`;
  }
}

export function cssStyleElementLineIconSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const iconSize = dvv("iconSize");
  const iconSizeSuffix = dvv("iconSizeSuffix");

  return `font-size: ${iconSize}${iconSizeSuffix};`;
}

export function cssStyleElementLineContentAlignBefore({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const horizontalAlign = readLineAlign(dvv("horizontalAlign"));

  switch (horizontalAlign) {
    case "left":
      return "display: none;";
    case "center":
    case "right":
    case undefined:
      return "";
  }
}
export function cssStyleElementLineContentAlignAfter({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const horizontalAlign = readLineAlign(dvv("horizontalAlign"));

  switch (horizontalAlign) {
    case "right":
      return "display: none;";
    case "left":
    case "center":
    case undefined:
      return "";
  }
}
