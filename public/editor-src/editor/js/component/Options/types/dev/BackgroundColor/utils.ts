import { GetModel } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import * as Math from "visual/utils/math/";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/isHex";
import * as Palette from "visual/utils/color/toPalette";
import { Value as BgValue } from "visual/component/Controls/BackgroundColor/entities";
import { Value as Color } from "visual/component/Options/types/dev/ColorPicker/entities/Value";
import { Value } from "./entities/Value";
import * as Type from "./entities/Type";
import * as GradientType from "./entities/GradientType";
import * as GradientActivePointer from "./entities/GradientActivePointer";
import { NumberSpec } from "visual/utils/math/number";
import { Reader } from "visual/utils/types/Type";
import { mApply } from "visual/utils/value";
import { inRange } from "visual/utils/math/";

export const fromElementModel: GetModel<Value> = get => {
  const v = get("gradientActivePointer");
  const pointer =
    v === "startPointer" ? "start" : v === "finishPointer" ? "end" : v;

  return {
    type: Type.read(get("bgColorType")) ?? "none",
    tempType: Type.read(get("tempBgColorType")) ?? "solid",
    hex: Hex.read(get("bgColorHex")) ?? "#000000",
    opacity: Opacity.read(get("bgColorOpacity")) ?? Opacity.empty,
    tempOpacity: Opacity.read(get("tempBgColorOpacity")) ?? 1,
    palette: Palette.read(get("bgColorPalette")) ?? "",
    tempPalette: Palette.read(get("tempBgColorPalette")) ?? "",
    hex2: Hex.read(get("gradientColorHex")) ?? "#000000",
    opacity2: Opacity.read(get("gradientColorOpacity")) ?? 1,
    tempOpacity2: Opacity.read(get("tempGradientColorOpacity")) ?? 1,
    palette2: Palette.read(get("gradientColorPalette")) ?? "",
    tempPalette2: Palette.read(get("tempGradientColorPalette")) ?? "",
    gradientType: GradientType.read(get("gradientType")) ?? "linear",
    start: Math.toNonNegative("gradientStartPointer") ?? 0,
    end: Math.toNonNegative("gradientFinishPointer") ?? 100,
    active: GradientActivePointer.read(pointer) ?? "start",
    linearDegree: NumberSpec.read(get("gradientLinearDegree")) ?? 0,
    radialDegree: NumberSpec.read(get("gradientRadialDegree")) ?? 0
  };
};

export const toElementModel = (v: Value): { [K in string]: Literal } => {
  const pointer = v.active === "start" ? "startPointer" : "finishPointer";
  return {
    bgColorType: v.type,
    tempBgColorType: v.tempType,
    bgColorHex: v.hex,
    bgColorOpacity: v.opacity,
    tempBgColorOpacity: v.tempOpacity,
    bgColorPalette: v.palette,
    tempBgColorPalette: v.tempPalette,
    gradientColorHex: v.hex2,
    gradientColorOpacity: v.opacity2,
    tempGradientColorOpacity: v.tempOpacity2,
    gradientColorPalette: v.palette2,
    tempGradientColorPalette: v.tempPalette2,
    gradientType: v.gradientType,
    gradientStartPointer: v.start,
    gradientFinishPointer: v.end,
    gradientActivePointer: pointer,
    gradientLinearDegree: v.linearDegree,
    gradientRadialDegree: v.radialDegree
  };
};

export const toBgControlValue = (v: Value): BgValue => {
  const isEnd = v.type === "gradient" && v.active === "end";
  return {
    hex: isEnd ? v.hex2 : v.hex,
    opacity: isEnd ? v.opacity2 : v.opacity,
    palette: isEnd ? v.palette2 : v.palette,
    type: v.type,
    start: v.start,
    end: v.end,
    active: v.active,
    degree: v.gradientType === "radial" ? v.linearDegree : v.linearDegree,
    gradientType: v.gradientType
  };
};

export const gradientToColor = (v: Value): Color => ({
  hex: v.hex2,
  opacity: v.opacity2,
  tempOpacity: v.tempOpacity2,
  palette: v.palette2,
  tempPalette: v.tempPalette2
});

export const colorToGradient = (
  v: Color
): {
  hex2: Value["hex2"];
  opacity2: Value["opacity2"];
  tempOpacity2: Value["tempOpacity2"];
  palette2: Value["palette2"];
  tempPalette2: Value["tempPalette2"];
} => ({
  hex2: v.hex,
  opacity2: v.opacity,
  tempOpacity2: v.tempOpacity,
  palette2: v.palette,
  tempPalette2: v.tempPalette
});

export const readPercent: Reader<number> = v =>
  mApply(v => (inRange(0, 100, v) ? v : undefined), NumberSpec.read(v));
