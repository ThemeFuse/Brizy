import {
  cssStyleBorderRadiusType,
  cssStyleColor,
  cssStyleDisplayBlock,
  cssStyleDisplayNone,
  cssStyleFlexVerticalAlign,
  cssStyleSizeHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { checkValue } from "../checkValue";
import { styleBgColor } from "../style2";
import { CSSValue } from "../style2/types";

type Size = "small" | "medium" | "large" | "custom";
type ClosePosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);
const getClosePosition = checkValue<ClosePosition>([
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight"
]);

export function cssStyleContainerPopup2CloseState({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const closeState = dvv("showCloseButton");

  return closeState === undefined
    ? ""
    : closeState === "on"
      ? cssStyleDisplayBlock()
      : cssStyleDisplayNone();
}

export function cssStyleContainerPopup2CloseColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "closeColor"
  });
}

export function cssStyleContainerPopup2CloseFontSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const closeSize = getSize(dvv("closeSize"));
  const closeCustomSize = dvv("closeCustomSize");
  const closeBgSize = dvv("closeBgSize");

  switch (closeSize) {
    case "small":
      return `font-size:${16 + closeBgSize * 2}px;`;
    case "medium":
      return `font-size:${24 + closeBgSize * 2}px;`;
    case "large":
      return `font-size:${32 + closeBgSize * 2}px;`;
    case "custom":
      return `font-size:${closeCustomSize + closeBgSize * 2}px;`;
    case undefined:
      return "";
  }
}

export function cssStyleContainerPopup2CloseBgSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const closeBgSize = dvv("closeBgSize");

  return `padding:${closeBgSize}px;`;
}

export function cssStyleContainerPopup2CloseBorderRadius({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadiusType({
    v,
    device,
    store,
    state,
    prefix: "close"
  });
}

export function cssStyleContainerPopup2CloseBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, store, prefix: "closeBg" });

  return bgColor ? `background-color:${bgColor};` : "";
}

export function cssStyleContainerPopup2ClosePosition({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const closeAlign = getClosePosition(dvv("closeAlign"));
  const closeHorizontalPosition = dvv("closeHorizontalPosition");
  const closeHorizontalPositionSuffix = dvv("closeHorizontalPositionSuffix");
  const closeVerticalPosition = dvv("closeVerticalPosition");
  const closeVerticalPositionSuffix = dvv("closeVerticalPositionSuffix");
  const closeCustomSize = dvv("closeCustomSize");
  const closeCloseBgSize = dvv("closeBgSize");
  const closePosition = dvv("closePosition");

  const vertical = `${
    closePosition === "outside"
      ? -closeVerticalPosition - closeCustomSize - closeCloseBgSize * 2
      : closeVerticalPosition
  }${closeVerticalPositionSuffix}`;

  const horizontal = `${
    closePosition === "outside"
      ? -closeHorizontalPosition - closeCustomSize - closeCloseBgSize * 2
      : closeHorizontalPosition
  }${closeHorizontalPositionSuffix}`;

  switch (closeAlign) {
    case "topLeft": {
      return `top:${vertical};left:${horizontal};right:auto;bottom:auto;`;
    }
    case "topRight": {
      return `top:${vertical};right:${horizontal};left:auto;bottom:auto;`;
    }
    case "bottomLeft": {
      return `bottom:${vertical};left:${horizontal};right:auto;top:auto;`;
    }
    case "bottomRight": {
      return `bottom:${vertical};right:${horizontal};left:auto;top:auto;`;
    }
    case undefined:
      return "";
  }
}

export function cssStyleContainerPopup2RowFlexVerticalAlign({
  v,
  device,
  state,
  store,
  prefix = "popupRow"
}: CSSValue): string {
  return cssStyleFlexVerticalAlign({ v, device, state, store, prefix });
}

export function cssStyleContainerPopup2CustomHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const columnSizeStyle = dvv("columnsHeightStyle");

  return columnSizeStyle === "custom2"
    ? cssStyleSizeHeight({ v, device, state, store, prefix: "columns" })
    : "";
}
