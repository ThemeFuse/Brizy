import { ElementModel } from "visual/component/Elements/Types";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";
import { State } from "../stateMode";
import { CSSValue } from "./types";

const getState = (v: ElementModel, state: State): string =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBgGradient({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const _state = getState(v, state);

  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state: _state });

  const bgColorType = dvv(capByPrefix(prefix, "bgColorType"));
  const gradientType = dvv(capByPrefix(prefix, "gradientType"));

  const bgColorHex = dvv(capByPrefix(prefix, "bgColorHex"));
  const bgColorPalette = dvv(capByPrefix(prefix, "bgColorPalette"));

  const gradientColorHex = dvv(capByPrefix(prefix, "gradientColorHex"));
  const gradientColorPalette = dvv(capByPrefix(prefix, "gradientColorPalette"));

  const bgColorOpacity = dvv(capByPrefix(prefix, "bgColorOpacity"));
  const gradientColorOpacity = dvv(capByPrefix(prefix, "gradientColorOpacity"));

  const gradientStartPointer = dvv(capByPrefix(prefix, "gradientStartPointer"));
  const gradientFinishPointer = dvv(
    capByPrefix(prefix, "gradientFinishPointer")
  );

  const gradientLinearDegree = dvv(capByPrefix(prefix, "gradientLinearDegree"));
  const gradientRadialDegree = dvv(capByPrefix(prefix, "gradientRadialDegree"));

  const bgColor = getColor(bgColorPalette, bgColorHex, bgColorOpacity);
  const bgGradientColor = getColor(
    gradientColorPalette,
    gradientColorHex,
    gradientColorOpacity
  );

  return bgColorType === "gradient"
    ? gradientType === "linear"
      ? `linear-gradient(${gradientLinearDegree}deg, ${bgColor} ${gradientStartPointer}%, ${bgGradientColor} ${gradientFinishPointer}%)`
      : `radial-gradient(circle ${gradientRadialDegree}px, ${bgColor} ${gradientStartPointer}%, ${bgGradientColor} ${gradientFinishPointer}%)`
    : "none";
}
