import { Base64 } from "js-base64";
import {
  getStyledLines,
  isDefaultLineType,
  isTypeWithoutWeight
} from "visual/editorComponents/Line/utils";
import { cssStyleBgColor, cssStyleBorder } from "visual/utils/cssStyle";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { styleAlignHorizontal, styleBorderColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { checkValue } from "../checkValue";
import { defaultValueValue } from "../onChange";
import { Reader } from "../reader/types";
import { capByPrefix } from "../string";
import { cssStyleDisplayNone } from "./cssStyleDisplay";

type lineHorizontalAlign = "right" | "left" | "center";
type Size = "small" | "medium" | "large" | "custom";

export const cssStyleElementLineStyledLineType = ({
  v,
  device,
  state
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const lineStyle = Str.read(dvv("lineStyle")) ?? "solid";

  if (isDefaultLineType(lineStyle)) {
    return "";
  }
  const weight = Num.read(dvv("weight")) ?? 1;
  const _weight = isTypeWithoutWeight(lineStyle) ? 1 : weight;

  const svg = getStyledLines(_weight)[lineStyle];
  const url = Base64.encode(svg);

  return `-webkit-mask-image:url("data:image/svg+xml;base64,${url}");mask-image:url("data:image/svg+xml;base64,${url}");`;
};

const readLineAlign: Reader<lineHorizontalAlign> = (v) => {
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
const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);

export function cssStyleElementLineBorder({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  const borderStyle = dvv("lineStyle") as string;
  const borderColor = styleBorderColor({ v, device, state });

  return isDefaultLineType(borderStyle)
    ? `border-top:${borderWidth}px ${borderStyle} ${borderColor};`
    : "border:none;";
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
  const horizontalAlign = readLineAlign(
    styleAlignHorizontal({ v, device, state })
  );
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
export function cssStyleElementLineContentAlignBefore({
  v,
  device,
  state
}: CSSValue): string {
  const horizontalAlign = readLineAlign(
    styleAlignHorizontal({ v, device, state })
  );
  switch (horizontalAlign) {
    case "left":
      return cssStyleDisplayNone();
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
  const horizontalAlign = readLineAlign(
    styleAlignHorizontal({ v, device, state })
  );
  switch (horizontalAlign) {
    case "right":
      return cssStyleDisplayNone();
    case "left":
    case "center":
    case undefined:
      return "";
  }
}
export function cssStyleCustomLineBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const lineStyle = dvv("lineStyle") as string;
  return isDefaultLineType(lineStyle)
    ? ""
    : cssStyleBgColor({ v, device, state, prefix: "border" });
}
export function cssStyleCustomLineSize({ v, device, state }: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const lineStyle = dvv("lineStyle") as string;
  if (isDefaultLineType(lineStyle)) {
    return "";
  }
  const lineSize = dvv("lineSize");
  const lineSizeSuffix = dvv("lineSizeSuffix");
  return `min-height:${lineSize}${lineSizeSuffix};`;
}
export function cssStyleCustomLineAmount({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const amount = dvv("amount");
  const amountSuffix = dvv("amountSuffix");
  return `mask-size: ${amount}${amountSuffix} 100%;
  -webkit-mask-size: ${amount}${amountSuffix} 100%;`;
}
export function cssStyleElementLineDisableAfter({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state });
  const style = dvv("style");
  return `display:${style === "default" ? "none" : "initial"};`;
}
export function cssStyleElementLineIconBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "iconBg" });
}
export function cssStyleElementLineIconBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "icon" });
}
export function cssStyleElementLineIconPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPadding = dvv("iconPadding");
  const iconPaddingSuffix = dvv("iconPaddingSuffix");
  return `padding:${iconPadding}${iconPaddingSuffix};`;
}
export function cssStyleElementLineIconRotate({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const degrees = dvv("iconRotate");
  return `transform:rotate(${degrees}deg);`;
}
export function cssStyleElementLineIconSize({
  v,
  device,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const size = getSize(dvv(capByPrefix(prefix, "iconSizeBtns")));
  const customSize = dvv(capByPrefix(prefix, "iconSize"));
  const customSizeSuffix = Str.read(dvv(capByPrefix(prefix, "iconSizeSuffix")));

  switch (size) {
    case "small":
      return `font-size:16px;`;
    case "medium":
      return `font-size:24px;`;
    case "large":
      return `font-size:32px;`;
    case "custom":
      return `font-size:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}
