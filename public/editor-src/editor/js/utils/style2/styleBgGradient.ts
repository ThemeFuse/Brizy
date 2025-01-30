import { Num, Str } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { hexToBlendedRgba } from "visual/utils/color/RGB";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";
import { State } from "../stateMode";
import { CSSValue } from "./types";
import { gradientCssDeclaration } from "./utils";

const getState = (v: ElementModel, state: State): string =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export const styleBgBlendGradient = ({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string => {
  const _state = getState(v, state);

  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state: _state });

  const colorType = Str.read(dvv(capByPrefix(prefix, "bgColorType")));
  const gradientType = Str.read(dvv(capByPrefix(prefix, "gradientType")));

  const bgColorHex = Str.read(dvv(capByPrefix(prefix, "bgColorHex")));

  const gradientColorHex = Str.read(
    dvv(capByPrefix(prefix, "gradientColorHex"))
  );

  const bgColorOpacity = Num.read(dvv(capByPrefix(prefix, "bgColorOpacity")));
  const gradientColorOpacity = Num.read(
    dvv(capByPrefix(prefix, "gradientColorOpacity"))
  );

  const gradientStartPointer = Num.read(
    dvv(capByPrefix(prefix, "gradientStartPointer"))
  );
  const gradientFinishPointer = Num.read(
    dvv(capByPrefix(prefix, "gradientFinishPointer"))
  );

  const gradientLinearDegree = Num.read(
    dvv(capByPrefix(prefix, "gradientLinearDegree"))
  );
  const gradientRadialDegree = Num.read(
    dvv(capByPrefix(prefix, "gradientRadialDegree"))
  );

  return gradientCssDeclaration({
    colorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    bgColor: hexToBlendedRgba({
      hex: bgColorHex,
      opacity: bgColorOpacity
    }),
    gradientColor: hexToBlendedRgba({
      hex: gradientColorHex,
      opacity: gradientColorOpacity
    })
  });
};

export function styleBgGradient({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const _state = getState(v, state);

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: _state });
  const config = configSelector(store.getState());

  const bgColorType = dvv(capByPrefix(prefix, "bgColorType"));
  const gradientType = dvv(capByPrefix(prefix, "gradientType"));

  const bgColorHex = dvv(capByPrefix(prefix, "bgColorHex"));
  const bgColorPalette = dvv(capByPrefix(prefix, "bgColorPalette"));

  const gradientColorHex = dvv(capByPrefix(prefix, "gradientColorHex"));
  const gradientColorPalette = dvv(capByPrefix(prefix, "gradientColorPalette"));

  const bgColorOpacity = dvv(capByPrefix(prefix, "bgColorOpacity"));
  const gradientColorOpacity = dvv(capByPrefix(prefix, "gradientColorOpacity"));

  const gradientStartPointer = Num.read(
    dvv(capByPrefix(prefix, "gradientStartPointer"))
  );
  const gradientFinishPointer = Num.read(
    dvv(capByPrefix(prefix, "gradientFinishPointer"))
  );

  const gradientLinearDegree = Num.read(
    dvv(capByPrefix(prefix, "gradientLinearDegree"))
  );
  const gradientRadialDegree = Num.read(
    dvv(capByPrefix(prefix, "gradientRadialDegree"))
  );

  return gradientCssDeclaration({
    colorType: bgColorType,
    gradientType,
    gradientLinearDegree,
    gradientRadialDegree,
    gradientStartPointer,
    gradientFinishPointer,
    bgColor: getColor(bgColorPalette, bgColorHex, bgColorOpacity, config),
    gradientColor: getColor(
      gradientColorPalette,
      gradientColorHex,
      gradientColorOpacity,
      config
    )
  });
}
