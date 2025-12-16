import { TypeObject } from "visual/component/Controls/BoxShadow/types";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Opacity from "visual/utils/cssProps/opacity";
import { t } from "visual/utils/i18n";
import { _apply, get } from "visual/utils/model";
import * as T from "visual/utils/options/BoxShadow/entities/Type";
import { Value } from "visual/utils/options/BoxShadow/entities/Value";
import * as ColorUtils from "../ColorPicker/utils";
import {
  getBlur,
  getHorizontal,
  getOpacity,
  getPalette,
  getSpread,
  getType,
  getVertical,
  setOpacity,
  setPalette,
  setType
} from "./model";

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
  const value = enable ? (T.noEmpty(getType(m)) ?? m.tempType) : T.NONE;

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
  const spread = m.spread || m.tempSpread;
  const horizontal = getHorizontal(m) || m.tempHorizontal;
  const vertical = getVertical(m) || m.tempVertical;

  return {
    ...m,
    blur: enable ? blur : Blur.empty,
    tempBlur: blur,
    spread: enable ? spread : 0,
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
  !!(getBlur(m) || getSpread(m) || getHorizontal(m) || getVertical(m));

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

export const getTypesItems = (ts: T.Type[]): TypeObject[] =>
  ts.map((id) => ({ id, title: getTypeTitle(id) }));

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
 * Alias to api.setOpacity with one exception. The tempOpacity will be updated only if `final` parameter is true
 */
export const _setOpacity = (v: Opacity.Opacity, m: Value, f: boolean): Value =>
  ColorUtils.setOpacity(setOpacity, v, m, f);
