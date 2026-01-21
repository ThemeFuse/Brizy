import { Num } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { State } from "../stateMode";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

const getState = (v: ElementModel, state: State): State =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementCounterChartEnd({ v }: CSSValue): string {
  return `stroke-dasharray: calc(${v.end} + 0.5) 100;`;
}

export function cssStyleElementCounterChartWidth({ v }: CSSValue): string {
  const strokeWidth = Math.min(32, Num.read(v.strokeWidth) ?? 32);
  return `stroke-width: ${strokeWidth} !important;`;
}

export function cssStyleElementCounterTextShadow({
  v,
  state,
  getConfig
}: CSSValue): string {
  state = getState(v, state);

  const dvv = (key: string) => defaultValueValue({ v, key, state });

  const textShadowColorHex = dvv("textShadowColorHex");
  const textShadowColorOpacity = dvv("textShadowColorOpacity");
  const textShadowColorPalette = dvv("textShadowColorPalette");

  const textShadowBlur = dvv("textShadowBlur");
  const textShadowVertical = dvv("textShadowVertical");
  const textShadowHorizontal = dvv("textShadowHorizontal");

  const config = getConfig();

  const shadowColor = getColor(
    textShadowColorPalette,
    textShadowColorHex,
    textShadowColorOpacity,
    config
  );

  return `text-shadow:${textShadowHorizontal}px ${textShadowVertical}px ${textShadowBlur}px ${shadowColor};`;
}

export const cssStyleElementCounterPrefixSuffixColor = (
  data: CSSValue
): string => cssStyleColor({ ...data, prefix: "prefixSuffixColor" });
