import {
  styleAlignFlexVerticalAlign,
  styleAlignHorizontal
} from "visual/utils/style2";
import { Reader } from "../reader/types";
import { CSSValue } from "../style2/types";

interface HorizontalAlign {
  left: string;
  center: string;
  right: string;
}

interface VerticalAlign {
  top: string;
  center: string;
  bottom: string;
  between: string;
}

const FlexHorizontalAligns: HorizontalAlign = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
} as const;

const FlexVerticalAligns: VerticalAlign = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
  between: "space-between"
} as const;

const readVerticalAlign: Reader<keyof VerticalAlign> = (v) => {
  switch (v) {
    case "top":
    case "center":
    case "bottom":
    case "between":
      return v;
  }
  return undefined;
};

const readHorizontalAlign: Reader<keyof HorizontalAlign> = (v) => {
  switch (v) {
    case "left":
    case "center":
    case "right":
      return v;
  }
  return undefined;
};

export function cssStyleFlexVerticalAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const alignItems = readVerticalAlign(
    styleAlignFlexVerticalAlign({ v, device, state, store, prefix })
  );

  return alignItems ? `align-items:${FlexVerticalAligns[alignItems]};` : "";
}

export function cssStyleFlexHorizontalAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, store, prefix })
  );

  return alignItems
    ? `justify-content:${FlexHorizontalAligns[alignItems]};`
    : "";
}

export function cssStyleMarginAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const aligns = {
    left: "margin-right: auto; margin-left: 0;",
    center: "margin-left: auto; margin-right: auto;",
    right: "margin-left: auto; margin-right: 0;"
  };
  const alignment = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, store, prefix })
  );

  return alignment ? aligns[alignment] : "";
}

export function cssStyleFlexColumnVerticalAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const alignItems = readVerticalAlign(
    styleAlignFlexVerticalAlign({ v, device, state, store, prefix })
  );

  return alignItems ? `justify-content:${FlexVerticalAligns[alignItems]};` : "";
}

export function cssStyleFlexColumnHorizontalAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, store, prefix })
  );

  return alignItems ? `align-items:${FlexHorizontalAligns[alignItems]};` : "";
}

export function cssStyleTextAlign({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const textAlign = styleAlignHorizontal({ v, device, state, store, prefix });

  return textAlign ? `text-align:${textAlign};` : "";
}

export function cssStyleContentAlign({
  v,
  device,
  state,
  store,
  prefix = "content"
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix });
}
