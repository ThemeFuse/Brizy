import { ElementModel } from "visual/component/Elements/Types";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { State } from "visual/utils/stateMode";
import { styleState } from "visual/utils/style";
import { isNullish } from "visual/utils/value";
import { defaultValueValue } from "../onChange";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

const getState = (v: ElementModel, state: State) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleDropShadow({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  state = getState(v, state);

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const dropShadowColorHex = dvv(capByPrefix(prefix, "colorHex"));
  const dropShadowColorOpacity = dvv(capByPrefix(prefix, "colorOpacity"));
  const dropShadowColorPalette = dvv(capByPrefix(prefix, "colorPalette"));

  const dropShadowBlur = dvv(capByPrefix(prefix, "blur"));
  const dropShadowVertical = dvv(capByPrefix(prefix, "vertical"));
  const dropShadowHorizontal = dvv(capByPrefix(prefix, "horizontal"));

  const { hex } = getOptionColorHexByPalette(
    dropShadowColorHex,
    dropShadowColorPalette
  );
  const dropShadowColor = hexToRgba(hex, dropShadowColorOpacity);

  const dropShadowIsNullish = [
    dropShadowHorizontal,
    dropShadowVertical,
    dropShadowBlur,
    dropShadowColor
  ].some((el) => isNullish(el));

  if (dropShadowIsNullish) {
    return "";
  }

  return `filter : drop-shadow(${dropShadowHorizontal}px ${dropShadowVertical}px ${dropShadowBlur}px ${dropShadowColor});`;
}
