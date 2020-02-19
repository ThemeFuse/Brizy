import * as String from "visual/utils/string";
import * as FontType from "visual/utils/fonts/familyType";
import * as FontWeight from "visual/utils/fonts/weight";
import * as Patch from "visual/utils/patch";
import * as Model from "./model";
import * as Math from "visual/utils/math";
import { toNumber } from "visual/utils/math";
import { getStore } from "visual/redux/store";
import { deviceModeSelector } from "visual/redux/selectors";
import { defaultValueValue } from "visual/utils/onChange";
import { getFontStyle } from "visual/utils/fonts";

/**
 * @param {function(k:string):string|number} get
 * @return {Typography}
 */
export const getModel = get => {
  return {
    fontFamily: String.toString(get("fontFamily"), ""),
    fontFamilyType: FontType.toType(get("fontFamilyType"), FontType.GOOGLE),
    fontStyle: String.toString(get("fontStyle"), ""),
    fontSize: Math.toPositive(get("fontSize"), 17),
    fontWeight: FontWeight.toWeight(get("fontWeight"), FontWeight.empty),
    letterSpacing: toNumber(get("letterSpacing"), 0.0),
    lineHeight: Math.toPositive(get("lineHeight"), 1.0)
  };
};

/**
 * @param {Typography} m
 * @return {Typography}
 */
export const fromGlobal = m => {
  const v = getFontStyle(m.fontStyle) || m;
  const device = deviceModeSelector(getStore().getState());
  const get = key => {
    return key === "fontStyle"
      ? m.fontStyle
      : defaultValueValue({ key, v, device });
  };

  return getModel(get);
};

/**
 * Set font family from a font object
 *
 * @param {string} id
 * @param {FontFamilyType} type
 * @param {number[]} weights
 * @param {Typography} m
 * @return {Typography}
 */
export const patchFontFamily = ({ id, type, weights }, m) => {
  const newWeight = weights.includes(Model.getFontWeight(m))
    ? undefined
    : FontWeight.empty;

  return Patch.apply(
    [
      [Model.patchFontFamily, id],
      [Model.patchFontFamilyType, type],
      [Model.patchFontWeight, newWeight]
    ],
    m
  );
};
