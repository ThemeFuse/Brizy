import {
  styleAlignFlexVerticalAlign,
  styleAlignHorizontal
} from "visual/utils/style2";
import { Reader } from "../reader/types";
import { CSSValue } from "../style2/types";
import { rtlAlign } from "./utils";

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

export const FlexHorizontalAligns: HorizontalAlign = {
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

export const readHorizontalAlign: Reader<keyof HorizontalAlign> = (v) => {
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
  getConfig,
  prefix = ""
}: CSSValue): string {
  const alignItems = readVerticalAlign(
    styleAlignFlexVerticalAlign({ v, device, state, getConfig, store, prefix })
  );

  return alignItems ? `align-items:${FlexVerticalAligns[alignItems]};` : "";
}

export function cssStyleFlexHorizontalAlign({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, getConfig, store, prefix })
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
  getConfig,
  prefix = ""
}: CSSValue): string {
  const aligns = {
    left: "margin-inline-end: auto; margin-inline-start: 0;",
    center: "margin-inline-start: auto; margin-inline-end: auto;",
    right: "margin-inline-start: auto; margin-inline-end: 0;"
  };
  const alignment = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, getConfig, store, prefix })
  );

  return alignment ? aligns[alignment] : "";
}

export function cssStyleFlexColumnVerticalAlign({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const alignItems = readVerticalAlign(
    styleAlignFlexVerticalAlign({ v, device, state, getConfig, store, prefix })
  );

  return alignItems ? `justify-content:${FlexVerticalAligns[alignItems]};` : "";
}

export function cssStyleFlexColumnHorizontalAlign({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({ v, device, state, getConfig, store, prefix })
  );

  return alignItems ? `align-items:${FlexHorizontalAligns[alignItems]};` : "";
}

export function cssStyleTextAlign({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const textAlign = styleAlignHorizontal({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });

  return textAlign ? `text-align:${rtlAlign(textAlign)};` : "";
}

export function cssStyleContentAlign({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "content"
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, getConfig, store, prefix });
}
