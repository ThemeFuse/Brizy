import { Num, Str } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { getColor } from "visual/utils/color";
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

  const dropShadowColorHex = Str.read(dvv(capByPrefix(prefix, "colorHex")));
  const dropShadowColorPalette = Str.read(
    dvv(capByPrefix(prefix, "colorPalette"))
  );
  const dropShadowColorOpacity = Num.read(
    dvv(capByPrefix(prefix, "colorOpacity"))
  );

  const dropShadowBlur = dvv(capByPrefix(prefix, "blur"));
  const dropShadowVertical = dvv(capByPrefix(prefix, "vertical"));
  const dropShadowHorizontal = dvv(capByPrefix(prefix, "horizontal"));

  const dropShadowIsNullish = [
    dropShadowHorizontal,
    dropShadowVertical,
    dropShadowBlur
  ].some((el) => isNullish(el));

  if (
    dropShadowIsNullish ||
    isNullish(dropShadowColorHex) ||
    isNullish(dropShadowColorPalette) ||
    isNullish(dropShadowColorOpacity)
  ) {
    return "";
  }

  const dropShadowColor = getColor(
    dropShadowColorPalette,
    dropShadowColorHex,
    dropShadowColorOpacity
  );

  return `--shadowColor: ${dropShadowColor} ${dropShadowHorizontal}px ${dropShadowVertical}px ${dropShadowBlur}px; filter: drop-shadow(var(--shadowColor));`;
}
