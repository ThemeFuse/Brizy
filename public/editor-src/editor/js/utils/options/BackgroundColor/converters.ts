import { GradientStop } from "visual/component/Controls/BackgroundColor/entities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Math from "visual/utils/math";
import * as Num from "visual/utils/math/number";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";
import * as Arr from "visual/utils/reader/array";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/string/specs";
import { MValue } from "visual/utils/value";
import * as GradientActivePointer from "./entities/GradientActivePointer";
import * as GradientType from "./entities/GradientType";
import * as Type from "./entities/Type";
import { Value } from "./entities/Value";

export const defaultValue: Value = {
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
  radialDegree: 0,
  gradientSpeed: 1,
  gradientStops: [],
  activeStopIndex: 0
};

export const readGradientStop = (value: unknown): MValue<GradientStop> => {
  const obj = Obj.read(value);

  if (!obj) {
    return undefined;
  }

  const position = Num.read(Obj.readKey("position")(obj));
  const hex =
    mPipe(Obj.readKey("hex"), Str.read, Hex.fromString)(obj) ?? undefined;
  const opacity = Num.read(Obj.readKey("opacity")(obj));
  const palette = Str.read(Obj.readKey("palette")(obj)) ?? "";

  if (position === undefined || hex === undefined || opacity === undefined) {
    return undefined;
  }

  return {
    position,
    hex,
    opacity,
    palette
  };
};

export const fromElementModel: FromElementModel<"backgroundColor"> = (get) => {
  const v = get("gradientActivePointer");
  const pointer =
    v === "startPointer" ? "start" : v === "finishPointer" ? "end" : v;

  return {
    type: mPipe(() => get("bgColorType"), Type.read)() ?? defaultValue.type,
    tempType:
      mPipe(() => get("tempBgColorType"), Type.read)() ?? defaultValue.tempType,
    hex:
      mPipe(() => get("bgColorHex"), Str.read, Hex.fromString)() ??
      defaultValue.hex,
    opacity:
      mPipe(() => get("bgColorOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.opacity,
    tempOpacity:
      mPipe(() => get("tempBgColorOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.tempOpacity,
    palette:
      mPipe(() => get("bgColorPalette"), Str.read, Palette.fromString)() ??
      defaultValue.palette,
    tempPalette:
      mPipe(() => get("tempPalette"), Str.read, Palette.fromString)() ??
      defaultValue.tempPalette,
    gradientHex:
      mPipe(() => get("gradientColorHex"), Str.read, Hex.fromString)() ??
      defaultValue.gradientHex,
    gradientOpacity:
      mPipe(
        () => get("gradientColorOpacity"),
        Num.read,
        Opacity.fromNumber
      )() ?? defaultValue.gradientOpacity,
    tempGradientOpacity:
      mPipe(
        () => get("tempGradientColorOpacity"),
        Num.read,
        Opacity.fromNumber
      )() ?? defaultValue.tempGradientOpacity,
    gradientPalette:
      mPipe(
        () => get("gradientColorPalette"),
        Str.read,
        Palette.fromString
      )() ?? defaultValue.gradientPalette,
    tempGradientPalette:
      mPipe(
        () => get("tempGradientColorPalette"),
        Str.read,
        Palette.fromString
      )() ?? defaultValue.tempGradientPalette,
    gradientType:
      GradientType.read(get("gradientType")) ?? defaultValue.gradientType,
    start:
      Math.toNonNegative(get("gradientStartPointer")) ?? defaultValue.start,
    end: Math.toNonNegative(get("gradientFinishPointer")) ?? defaultValue.end,
    active: GradientActivePointer.read(pointer),
    linearDegree:
      Num.read(get("gradientLinearDegree")) ?? defaultValue.linearDegree,
    radialDegree:
      Num.read(get("gradientRadialDegree")) ?? defaultValue.radialDegree,
    gradientSpeed: Num.read(get("gradientSpeed")) ?? defaultValue.gradientSpeed,
    gradientStops:
      mPipe(
        () => get("gradientStops"),
        Arr.readWithItemReader(readGradientStop)
      )() ?? defaultValue.gradientStops,
    activeStopIndex:
      Num.read(get("activeStopIndex")) ?? defaultValue.activeStopIndex
  };
};

export const toElementModel: ToElementModel<"backgroundColor"> = (v) => {
  const pointer = v.active === "start" ? "startPointer" : "finishPointer";

  return {
    bgColorType: v.type,
    tempBgColorType: v.tempType,
    bgColorHex: v.hex,
    bgColorOpacity: v.opacity,
    tempBgColorOpacity: v.tempOpacity,
    bgColorPalette: v.palette,
    tempBgColorPalette: v.tempPalette,
    gradientColorHex: v.gradientHex,
    gradientColorOpacity: v.gradientOpacity,
    tempGradientColorOpacity: v.tempGradientOpacity,
    gradientColorPalette: v.gradientPalette,
    tempGradientColorPalette: v.tempGradientPalette,
    gradientType: v.gradientType,
    gradientStartPointer: v.start,
    gradientFinishPointer: v.end,
    gradientActivePointer: pointer,
    gradientLinearDegree: v.linearDegree,
    gradientRadialDegree: v.radialDegree,
    ...(v.type === "animated-gradient"
      ? {
          gradientSpeed: v.gradientSpeed,
          gradientStops: v.gradientStops,
          activeStopIndex: v.activeStopIndex
        }
      : {})
  };
};
