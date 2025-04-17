import {
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStyleSpacing
} from "visual/utils/cssStyle";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementPostInfoColorIcons({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "iconsColor"
  });
}

export function cssStyleElementPostInfoSpacing({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const large = dvv("large");

  return large === "inline"
    ? cssStyleSpacing({
        v,
        device,
        state,
        store,
        getConfig,
        prefix: "text",
        direction: "right"
      })
    : cssStyleSpacing({
        v,
        device,
        state,
        store,
        getConfig,
        prefix: "text",
        direction: "top"
      });
}

export function cssStyleElementPostInfoDirection({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const orientation = dvv("orientation");

  switch (orientation) {
    case "inline":
      return "flex-direction:row;";
    case "column":
      return "flex-direction:column;";
  }

  return "";
}

export function cssStyleElementPostInfoAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "content"
  });
}

export function cssStyleElementPostInfoSpacingCloud({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const orientation = dvv("orientation");

  return orientation === "inline"
    ? cssStyleSpacing({
        v,
        device,
        state,
        store,
        getConfig,
        prefix: "text",
        direction: "right"
      })
    : cssStyleSpacing({
        v,
        device,
        state,
        store,
        getConfig,
        prefix: "text",
        direction: "top"
      });
}
