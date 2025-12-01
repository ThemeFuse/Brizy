import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import * as Hex from "visual/utils/color/Hex";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Opacity from "visual/utils/cssProps/opacity";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import * as Palette from "../ColorPicker/entities/palette";
import * as T from "./entities/Type";
import { Value } from "./entities/Value";
import { fromLegacyType, toLegacyType } from "./utils";

export const defaultValue: Value = {
  type: T.empty,
  tempType: T.OUTSET,
  hex: Hex.Black,
  opacity: Opacity.empty,
  tempOpacity: Opacity.unsafe(1),
  palette: Palette.empty,
  tempPalette: Palette.empty,
  blur: Blur.unsafe(0),
  tempBlur: Blur.unsafe(4),
  spread: 0,
  tempSpread: 2,
  vertical: 0,
  tempVertical: 0,
  horizontal: 0,
  tempHorizontal: 0
};

/**
 *
 * @param get
 * @return {object}
 */
export const fromElementModel: FromElementModel<"boxShadow"> = (get) => {
  const partial = {
    type: mPipe(() => get("value"), Str.read, fromLegacyType)() ?? T.empty,
    opacity:
      mPipe(() => get("colorOpacity"), Num.read, Opacity.fromNumber)() ??
      Opacity.empty,
    blur: mPipe(() => get("blur"), Num.read, Blur.fromNumber)() ?? Blur.empty,
    spread: mPipe(() => get("spread"), Num.read)() ?? 0,
    vertical: mPipe(() => get("vertical"), Num.read)() ?? defaultValue.vertical,
    horizontal:
      mPipe(() => get("horizontal"), Num.read)() ?? defaultValue.horizontal
  };

  const isEmpty =
    partial.type === T.empty ||
    partial.opacity === Opacity.empty ||
    (partial.blur === Blur.empty &&
      partial.spread === 0 &&
      partial.vertical === 0 &&
      partial.horizontal === 0);

  return {
    type: isEmpty ? defaultValue.type : partial.type,
    tempType:
      mPipe(() => get("tempValue"), Str.read, fromLegacyType)() ??
      defaultValue.tempType,
    hex:
      mPipe(() => get("colorHex"), Str.read, Hex.fromString)() ??
      defaultValue.hex,
    opacity: isEmpty ? defaultValue.opacity : partial.opacity,
    tempOpacity:
      mPipe(() => get("tempColorOpacity"), Num.read, Opacity.fromNumber)() ??
      defaultValue.tempOpacity,
    palette: isEmpty
      ? defaultValue.palette
      : (mPipe(() => get("colorPalette"), Str.read, Palette.fromString)() ??
        Palette.empty),
    tempPalette:
      mPipe(() => get("tempColorPalette"), Str.read, Palette.fromString)() ??
      defaultValue.tempPalette,
    blur: isEmpty ? defaultValue.blur : partial.blur,
    tempBlur:
      mPipe(() => get("tempBlur"), Num.read, Blur.fromNumber)() ??
      defaultValue.tempBlur,
    spread: isEmpty ? defaultValue.spread : partial.spread,
    tempSpread:
      mPipe(() => get("tempSpread"), Num.read)() ?? defaultValue.tempSpread,
    vertical: isEmpty ? defaultValue.vertical : partial.vertical,
    tempVertical: Num.read(get("tempVertical")) ?? defaultValue.tempVertical,
    horizontal: isEmpty ? defaultValue.horizontal : partial.horizontal,
    tempHorizontal:
      Num.read(get("tempHorizontal")) ?? defaultValue.tempHorizontal
  };
};

/**
 * Converts box shadow model to db model
 */
export const toElementModel: ToElementModel<"boxShadow"> = (m) => {
  return {
    value: toLegacyType(m.type),
    tempValue: toLegacyType(m.tempType),
    colorHex: m.hex,
    colorPalette: m.palette,
    tempColorPalette: m.tempPalette,
    colorOpacity: m.opacity,
    tempColorOpacity: m.tempOpacity,
    blur: m.blur,
    tempBlur: m.tempBlur,
    spread: m.spread,
    tempSpread: m.tempSpread,
    vertical: m.vertical,
    tempVertical: m.tempVertical,
    horizontal: m.horizontal,
    tempHorizontal: m.tempHorizontal
  };
};
