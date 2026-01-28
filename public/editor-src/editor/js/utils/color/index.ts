import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import * as Hex from "visual/utils/color/Hex";
import { MValue } from "visual/utils/value";
import {
  makeGlobalStylesColorPalette,
  makeStylePaletteCSSVar
} from "./makeGlobalStylesColorPallete";

const rgbRegex = /^rgb\s*[(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*[)]$/;
const rgbaRegex =
  /^rgba\s*[(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0*(?:\.\d+)?|1(?:\.0*)?)\s*[)]$/;

export function parseColorString(colorString: string) {
  if (isHex(colorString)) {
    return {
      hex: colorString,
      opacity: 1
    };
  }

  const rgbResult = parseRgb(colorString);
  if (rgbResult) {
    return {
      hex: Hex.fromRgb(rgbResult),
      opacity: 1
    };
  }

  const rgbaResult = parseRgba(colorString);
  if (rgbaResult) {
    return {
      hex: Hex.fromRgb([rgbaResult[0], rgbaResult[1], rgbaResult[2]]),
      opacity: String(rgbaResult[3])
    };
  }

  return null;
}

export const isHex = (v: string) => Hex.is(v ?? "");

export function hexToRgba(_hex: string, opacity: number): MValue<string> {
  let hex = Hex.isShorthand(_hex) ? Hex.toLonghand(_hex) : _hex;

  if (isHex(hex)) {
    hex = hex.replace("#", "");
    opacity = !isNaN(opacity) ? opacity : 1;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return undefined;
}

export function hexToRgb(_hex: string): MValue<string> {
  let hex = Hex.isShorthand(_hex) ? Hex.toLonghand(_hex) : _hex;

  if (isHex(hex)) {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }

  return undefined;
}

export function getColor(
  palette: string,
  hex: string,
  opacity: number,
  config: ConfigCommon
): MValue<string> {
  if (palette) {
    return `rgba(var(${makeStylePaletteCSSVar(palette, config)}),${opacity})`;
  } else {
    return hexToRgba(hex, opacity);
  }
}

export function getColorToolbar(
  palette: string,
  hex: string,
  opacity: number
): MValue<string> {
  if (palette) {
    return `rgba(var(--brz-global-${palette}),${opacity})`;
  } else {
    return hexToRgba(hex, opacity);
  }
}

export function getColorPalette(
  palette: string,
  hex: string,
  opacity: number,
  config: ConfigCommon
): string {
  if (palette) {
    return `rgba(var(${makeStylePaletteCSSVar(palette, config)}), ${opacity})`;
  }

  return hex;
}

export function parseRgb(
  colorString: string
): MValue<[number, number, number]> {
  const matches = rgbRegex.exec(colorString);

  if (!matches) {
    return;
  }

  return matches.slice(1).map(Number) as [number, number, number];
}

function parseRgba(
  colorString: string
): MValue<[number, number, number, number]> {
  const matches = rgbaRegex.exec(colorString);
  if (!matches) {
    return;
  }

  return matches.slice(1).map(Number) as [number, number, number, number];
}

export { makeRichTextColorPaletteCSS } from "./makeRichTextColorPaletteCSS";
export { makeRichTextDCColorCSS } from "./makeRichTextDCColorCSS";
export { makeGlobalStylesColorPalette, makeStylePaletteCSSVar };
