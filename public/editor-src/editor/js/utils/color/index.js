import Config from "visual/global/Config";
import * as Hex from "visual/utils/color/Hex";
import {
  makeGlobalStylesColorPalette,
  makeStylePaletteCSSVar
} from "./makeGlobalStylesColorPallete";

const rgbRegex = /^rgb\s*[(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*[)]$/;
const rgbaRegex =
  /^rgba\s*[(]\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0*(?:\.\d+)?|1(?:\.0*)?)\s*[)]$/;

export function parseColorString(colorString) {
  if (isHex(colorString)) {
    return {
      hex: colorString,
      opacity: 1
    };
  }

  var rgbResult = parseRgb(colorString);
  if (rgbResult) {
    return {
      hex: Hex.fromRgb(rgbResult),
      opacity: 1
    };
  }

  var rgbaResult = parseRgba(colorString);
  if (rgbaResult) {
    return {
      hex: Hex.fromRgb(rgbaResult),
      opacity: String(rgbaResult[3])
    };
  }

  return null;
}

export const isHex = (v) => Hex.is(v ?? "");

export function hexToRgba(_hex, opacity) {
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

export function hexToRgb(_hex) {
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

export function getColor(palette, hex, opacity) {
  if (palette) {
    const config = Config.getAll();
    return `rgba(var(${makeStylePaletteCSSVar(palette, config)}),${opacity})`;
  } else {
    return hexToRgba(hex, opacity);
  }
}

function parseRgb(colorString) {
  var matches = rgbRegex.exec(colorString);
  return matches && matches.slice(1).map(Number);
}

function parseRgba(colorString) {
  var matches = rgbaRegex.exec(colorString);
  return matches && matches.slice(1).map(Number);
}

export { getColorPaletteColor } from "./getColorPaletteColor";
export { getColorPaletteColors } from "./getColorPaletteColors";
export { makeRichTextColorPaletteCSS } from "./makeRichTextColorPaletteCSS";
export { makeRichTextDCColorCSS } from "./makeRichTextDCColorCSS";
export { makeGlobalStylesColorPalette, makeStylePaletteCSSVar };
