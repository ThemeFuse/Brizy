import {
  getBlur,
  getHorizontal,
  getSpread,
  getVertical,
  setOpacity,
  setPalette,
  setType,
  getPalette,
  getOpacity,
  getType
} from "./model";
import * as ColorUtils from "visual/component/Options/types/dev/ColorPicker/utils";
import { get, _apply } from "visual/utils/model";
import { t } from "visual/utils/i18n";
import * as T from "visual/component/Options/types/dev/BoxShadow/entities/Type";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Spread from "visual/utils/cssProps/Spread";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import { Value } from "./entities/Value";
import { GetModel } from "visual/component/Options/Type";
import { mPipe } from "visual/utils/fp";
import { TypeObject } from "visual/component/Controls/BoxShadow/types";
import { ElementModel } from "visual/component/Elements/Types";

export const DEFAULT_VALUE: Value = {
  type: T.empty,
  tempType: T.OUTSET,
  hex: Hex.Black,
  opacity: Opacity.empty,
  tempOpacity: Opacity.unsafe(1),
  palette: Palette.empty,
  tempPalette: Palette.empty,
  blur: Blur.unsafe(0),
  tempBlur: Blur.unsafe(4),
  spread: Spread.unsafe(0),
  tempSpread: Spread.unsafe(2),
  vertical: 0,
  tempVertical: 0,
  horizontal: 0,
  tempHorizontal: 0
};

/**
 * Toggles shadow type
 *  - on enable, set opacity to the latest non empty value
 *  - on disable, set type to 0
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleColor = (enable: boolean, m: Value): Value => {
  const opacity = enable ? getOpacity(m) || get("tempOpacity", m) : 0;
  const palette = enable ? getPalette(m) || get("tempPalette", m) : "";

  return _apply(
    [
      [setOpacity, opacity],
      [setPalette, palette]
    ],
    m
  );
};

/**
 * Toggles shadow type
 *  - on enable, set type to the latest non empty value
 *  - on disable, set type to NONE
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleType = (enable: boolean, m: Value): Value => {
  const value = enable ? T.noEmpty(getType(m)) ?? m.tempType : T.NONE;

  return setType(value, m);
};

/**
 *
 * @param {boolean} enable
 * @param {object} m
 * @return {object}
 */
export const toggleFields = (enable: boolean, m: Value): Value => {
  const blur = Blur.append(m.blur, m.tempBlur);
  const spread = Spread.append(m.spread, m.tempSpread);
  const horizontal = getHorizontal(m) || m.tempHorizontal;
  const vertical = getVertical(m) || m.tempVertical;

  return {
    ...m,
    blur: enable ? blur : Blur.empty,
    tempBlur: blur,
    spread: enable ? spread : Spread.empty,
    tempSpread: spread,
    vertical: enable ? vertical : 0,
    tempVertical: vertical,
    horizontal: enable ? horizontal : 0,
    tempHorizontal: horizontal
  };
};

/**
 * Check if shadow options are enabled
 *
 * @param {object} m
 * @return {boolean}
 */
export const fieldsEnabled = (m: Value): boolean =>
  !!(getBlur(m) || getSpread(m));

export const getTypeTitle = (type: T.Type): string => {
  switch (type) {
    case "none":
      return t("None");
    case "inset":
      return t("Inset");
    case "outset":
      return t("Outset");
  }
};

export const getTypesItems = (): TypeObject[] =>
  T.types.map(id => ({ id, title: getTypeTitle(id) }));

/**
 * Converts a legacy box shadow value to a valid box shadow type value
 *
 * @param {string} v
 * @return {string}
 */
export const fromLegacyType = (v: string): T.Type | undefined =>
  v === "on" ? T.OUTSET : v === "" ? T.NONE : T.fromString(v);

/**
 * Converts a box shadow type value to a legacy value
 *
 * @param {string} v
 * @return {string}
 */
export const toLegacyType = (v: T.Type): "" | "on" | T.Type => {
  switch (v) {
    case T.NONE:
      return "";
    case T.OUTSET:
      return "on";
    default:
      return v;
  }
};

/**
 *
 * @param get
 * @return {object}
 */
export const fromElementModel: GetModel<Value> = get => {
  const partial = {
    type: mPipe(() => get("value"), Str.read, fromLegacyType)() ?? T.empty,
    opacity:
      mPipe(() => get("colorOpacity"), Num.read, Opacity.fromNumber)() ??
      Opacity.empty,
    blur: mPipe(() => get("blur"), Num.read, Blur.fromNumber)() ?? Blur.empty,
    spread:
      mPipe(() => get("spread"), Num.read, Spread.fromNumber)() ?? Spread.empty
  };

  const isEmpty =
    partial.type === T.empty ||
    partial.opacity === Opacity.empty ||
    (partial.blur === Blur.empty && partial.spread === 0);

  return {
    type: isEmpty ? DEFAULT_VALUE.type : partial.type,
    tempType:
      mPipe(() => get("tempValue"), Str.read, fromLegacyType)() ??
      DEFAULT_VALUE.tempType,
    hex:
      mPipe(() => get("colorHex"), Str.read, Hex.fromString)() ??
      DEFAULT_VALUE.hex,
    opacity: isEmpty ? DEFAULT_VALUE.opacity : partial.opacity,
    tempOpacity:
      mPipe(() => get("tempColorOpacity"), Num.read, Opacity.fromNumber)() ??
      DEFAULT_VALUE.tempOpacity,
    palette: isEmpty
      ? DEFAULT_VALUE.palette
      : mPipe(() => get("colorPalette"), Str.read, Palette.fromString)() ??
        Palette.empty,
    tempPalette:
      mPipe(() => get("tempColorPalette"), Str.read, Palette.fromString)() ??
      DEFAULT_VALUE.tempPalette,
    blur: isEmpty ? DEFAULT_VALUE.blur : partial.blur,
    tempBlur:
      mPipe(() => get("tempBlur"), Num.read, Blur.fromNumber)() ??
      DEFAULT_VALUE.tempBlur,
    spread: isEmpty ? DEFAULT_VALUE.spread : partial.spread,
    tempSpread:
      mPipe(() => get("tempSpread"), Num.read, Spread.fromNumber)() ??
      DEFAULT_VALUE.tempSpread,
    vertical: isEmpty ? 0 : Num.read(get("vertical")) ?? DEFAULT_VALUE.vertical,
    tempVertical: Num.read(get("tempVertical")) ?? DEFAULT_VALUE.tempVertical,
    horizontal: isEmpty
      ? 0
      : Num.read(get("horizontal")) ?? DEFAULT_VALUE.horizontal,
    tempHorizontal:
      Num.read(get("tempHorizontal")) ?? DEFAULT_VALUE.tempHorizontal
  };
};

/**
 * Converts box shadow model to db model
 */
export const toElementModel = (
  m: Value,
  get: (k: string) => string
): ElementModel => {
  return {
    [get("value")]: toLegacyType(m.type),
    [get("tempValue")]: toLegacyType(m.tempType),
    [get("colorHex")]: m.hex,
    [get("colorPalette")]: m.palette,
    [get("tempColorPalette")]: m.tempPalette,
    [get("colorOpacity")]: m.opacity,
    [get("tempColorOpacity")]: m.tempOpacity,
    [get("blur")]: m.blur,
    [get("tempBlur")]: m.tempBlur,
    [get("spread")]: m.spread,
    [get("tempSpread")]: m.tempSpread,
    [get("vertical")]: m.vertical,
    [get("tempVertical")]: m.tempVertical,
    [get("horizontal")]: m.horizontal,
    [get("tempHorizontal")]: m.tempHorizontal
  };
};

/**
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 */
export const _setOpacity = (v: Opacity.Opacity, m: Value, f: boolean): Value =>
  ColorUtils.setOpacity(setOpacity, v, m, f);
