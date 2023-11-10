import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleFontSizeIconOldOption",
        "cssStyleElementIconBgColor",
        "cssStyleElementIconBgGradient",
        "cssStyleElementIconPadding",
        "cssStyleStrokeWidth",
        "cssStyleBorderRadiusType"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementIconPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleWrapper(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleElementIconSizeStory"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
