import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementCounterChartEnd({ v }) {
  return `stroke-dasharray: calc(${v.end} + 0.5) 100;`;
}

export function cssStyleElementCounterChartWidth({ v }) {
  const strokeWidth = Math.min(32, v.strokeWidth);
  return `stroke-width: ${strokeWidth} !important;`;
}

export function cssStyleElementCounterTextShadow({ v, state }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, state });

  const textShadowColorHex = dvv("textShadowColorHex");
  const textShadowColorOpacity = dvv("textShadowColorOpacity");
  const textShadowColorPalette = dvv("textShadowColorPalette");

  const textShadowBlur = dvv("textShadowBlur");
  const textShadowVertical = dvv("textShadowVertical");
  const textShadowHorizontal = dvv("textShadowHorizontal");

  const { hex } = getOptionColorHexByPalette(
    textShadowColorHex,
    textShadowColorPalette
  );
  const shadowColor = hexToRgba(hex, textShadowColorOpacity);

  return `text-shadow:${textShadowHorizontal}px ${textShadowVertical}px ${textShadowBlur}px ${shadowColor};`;
}
