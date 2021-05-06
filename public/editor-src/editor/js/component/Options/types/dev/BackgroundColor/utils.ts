import { GetModel, GetElementModel } from "visual/component/Options/Type";
import * as Str from "visual/utils/string/specs";
import * as Math from "visual/utils/math/";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/Hex";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { Value as BgValue } from "visual/component/Controls/BackgroundColor/entities";
import { Value as Color } from "visual/component/Options/types/dev/ColorPicker/entities/Value";
import { Value } from "./entities/Value";
import * as Type from "./entities/Type";
import * as GradientType from "./entities/GradientType";
import * as GradientActivePointer from "./entities/GradientActivePointer";
import * as Num from "visual/utils/math/number";
import { Reader } from "visual/utils/types/Type";
import { mApply } from "visual/utils/value";
import { inRange } from "visual/utils/math/";
import { mPipe } from "visual/utils/fp";

export const DEFAULT_VALUE: Value = {
  type: "none",
  tempType: "solid",
  hex: Hex.Black,
  opacity: Opacity.empty,
  tempOpacity: Opacity.unsafe(1),
  palette: "",
  tempPalette: "",
  gradientHex: Hex.Black,
  gradientOpacity: Opacity.unsafe(1),
  tempGradientOpacity: Opacity.unsafe(1),
  gradientPalette: "",
  tempGradientPalette: "",
  gradientType: "linear",
  start: 0,
  end: 100,
  active: "start",
  linearDegree: 0,
  radialDegree: 0
};

export const fromElementModel: GetModel<Value> = get => {
  const v = get("gradientActivePointer");
  const pointer =
    v === "startPointer" ? "start" : v === "finishPointer" ? "end" : v;

  return {
    type: Type.read(get("bgColorType")),
    tempType: Type.read(get("tempBgColorType")),
    hex:
      mPipe(() => get("bgColorHex"), Str.read, Hex.fromString)() ??
      DEFAULT_VALUE.hex,
    opacity:
      mPipe(() => get("bgColorOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.opacity,
    tempOpacity:
      mPipe(() => get("tempBgColorOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.tempOpacity,
    palette:
      mPipe(() => get("bgColorPalette"), Str.read, Palette.fromString)() ??
      DEFAULT_VALUE.palette,
    tempPalette:
      mPipe(() => get("tempPalette"), Str.read, Palette.fromString)() ??
      DEFAULT_VALUE.tempPalette,
    gradientHex:
      mPipe(() => get("gradientColorHex"), Str.read, Hex.fromString)() ??
      DEFAULT_VALUE.gradientHex,
    gradientOpacity:
      mPipe(
        () => get("gradientColorOpacity"),
        Num.read,
        Opacity.fromNumber
      )() ?? DEFAULT_VALUE.gradientOpacity,
    tempGradientOpacity:
      mPipe(
        () => get("tempGradientColorOpacity"),
        Num.read,
        Opacity.fromNumber
      )() ?? DEFAULT_VALUE.tempGradientOpacity,
    gradientPalette:
      mPipe(
        () => get("gradientColorPalette"),
        Str.read,
        Palette.fromString
      )() ?? DEFAULT_VALUE.gradientPalette,
    tempGradientPalette:
      mPipe(
        () => get("tempGradientColorPalette"),
        Str.read,
        Palette.fromString
      )() ?? DEFAULT_VALUE.tempGradientPalette,
    gradientType:
      GradientType.read(get("gradientType")) ?? DEFAULT_VALUE.gradientType,
    start:
      Math.toNonNegative(get("gradientStartPointer")) ?? DEFAULT_VALUE.start,
    end: Math.toNonNegative(get("gradientFinishPointer")) ?? DEFAULT_VALUE.end,
    active: GradientActivePointer.read(pointer),
    linearDegree:
      Num.read(get("gradientLinearDegree")) ?? DEFAULT_VALUE.linearDegree,
    radialDegree:
      Num.read(get("gradientRadialDegree")) ?? DEFAULT_VALUE.radialDegree
  };
};

export const toElementModel: GetElementModel<Value> = (v, get) => {
  const pointer = v.active === "start" ? "startPointer" : "finishPointer";
  return {
    [get("bgColorType")]: v.type,
    [get("tempBgColorType")]: v.tempType,
    [get("bgColorHex")]: v.hex,
    [get("bgColorOpacity")]: v.opacity,
    [get("tempBgColorOpacity")]: v.tempOpacity,
    [get("bgColorPalette")]: v.palette,
    [get("tempBgColorPalette")]: v.tempPalette,
    [get("gradientColorHex")]: v.gradientHex,
    [get("gradientColorOpacity")]: v.gradientOpacity,
    [get("tempGradientColorOpacity")]: v.tempGradientOpacity,
    [get("gradientColorPalette")]: v.gradientPalette,
    [get("tempGradientColorPalette")]: v.tempGradientPalette,
    [get("gradientType")]: v.gradientType,
    [get("gradientStartPointer")]: v.start,
    [get("gradientFinishPointer")]: v.end,
    [get("gradientActivePointer")]: pointer,
    [get("gradientLinearDegree")]: v.linearDegree,
    [get("gradientRadialDegree")]: v.radialDegree
  };
};

export const toBgControlValue = (v: Value): BgValue => {
  const isEnd = v.type === "gradient" && v.active === "end";
  return {
    hex: isEnd ? v.gradientHex : v.hex,
    opacity: isEnd ? v.gradientOpacity : v.opacity,
    palette: isEnd ? v.gradientPalette : v.palette,
    type: v.type,
    start: v.start,
    end: v.end,
    active: v.active,
    degree: v.gradientType === "radial" ? v.linearDegree : v.linearDegree,
    gradientType: v.gradientType
  };
};

export const gradientToColor = (v: Value): Color => ({
  hex: v.gradientHex,
  opacity: v.gradientOpacity,
  tempOpacity: v.tempGradientOpacity,
  palette: v.gradientPalette,
  tempPalette: v.tempGradientPalette
});

export const colorToGradient = (
  v: Color
): {
  gradientHex: Value["gradientHex"];
  gradientOpacity: Value["gradientOpacity"];
  tempGradientOpacity: Value["tempGradientOpacity"];
  gradientPalette: Value["gradientPalette"];
  tempGradientPalette: Value["tempGradientPalette"];
} => ({
  gradientHex: v.hex,
  gradientOpacity: v.opacity,
  tempGradientOpacity: v.tempOpacity,
  gradientPalette: v.palette,
  tempGradientPalette: v.tempPalette
});

export const readPercent: Reader<number> = v =>
  mApply(v => (inRange(0, 100, v) ? v : undefined), Num.read(v));
