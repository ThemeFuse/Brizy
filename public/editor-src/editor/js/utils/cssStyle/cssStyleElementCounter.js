import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
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

export function cssStyleElementCounterTextShadow({ v, state, store }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, state });

  const textShadowColorHex = dvv("textShadowColorHex");
  const textShadowColorOpacity = dvv("textShadowColorOpacity");
  const textShadowColorPalette = dvv("textShadowColorPalette");

  const textShadowBlur = dvv("textShadowBlur");
  const textShadowVertical = dvv("textShadowVertical");
  const textShadowHorizontal = dvv("textShadowHorizontal");

  const config = configSelector(store.getState());

  const shadowColor = getColor(
    textShadowColorPalette,
    textShadowColorHex,
    textShadowColorOpacity,
    config
  );

  return `text-shadow:${textShadowHorizontal}px ${textShadowVertical}px ${textShadowBlur}px ${shadowColor};`;
}
