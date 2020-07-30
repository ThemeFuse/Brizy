// ToDo.. La Border Radius de ce se activeaza BG si nu Border din valoarea 0????

import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped,
  onChangeDependeciesGrouped,
  onChangeDependeciesUngrouped
} from "./onChange";
import { capByPrefix } from "visual/utils/string";

export function onChangeBorderRadiusGrouped({
  v,
  device,
  state,
  value,
  sliderDragEnd,
  prefix = ""
}) {
  /**
   * ### OUTPUT EXAMPLE
   *
   * borderRadius,
   * borderTopLeftRadius: borderRadius,
   * borderTopRightRadius: borderRadius,
   * borderBottomLeftRadius: borderRadius,
   * borderBottomRightRadius: borderRadius,
   *
   * // ToDo.. Nu e nevoie de sliderDragEnd pentry ca Radius accepta valoarea 0
   * // SliderDragEnd e folositor doar pentru cazul cind temp ii mai mare de > 0 ca la Border Width
   *
   * tempBorderRadius: borderRadius
   * tempBorderTopLeftRadius: borderTopLeftRadius,
   * tempBorderTopRightRadius: borderTopRightRadius,
   * tempBorderBottomRightRadius: borderBottomRightRadius,
   * tempBorderBottomLeftRadius: borderBottomLeftRadius,
   */

  const parent = capByPrefix(prefix, "borderRadius");
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ].map(child => capByPrefix(prefix, child));
  const temp = true;
  const tempZero = true;

  return onChangeGroupedAndUngroupedByGrouped({
    v,
    device,
    state,
    parent,
    childs,
    value,
    sliderDragEnd,
    temp,
    tempZero
  });
}

export function onChangeBorderRadiusGroupedDependencies({
  v,
  device,
  state,
  value,
  prefix = ""
}) {
  // ToDo..
  // Asta trebuei de analizat si devazut ce facem cu ea ???
  /**
   * bgColorOpacity:
   *   value > 0 && v.borderColorOpacity === 0
   *     ? v.tempBgColorOpacity
   *     : v.bgColorOpacity
   */
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ].map(child => capByPrefix(prefix, child));
  const tempZero = true;
  const dependencies = {
    borderStyle: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderWidth: {
      childs,
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderColorOpacity: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderColorPalette: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value,
    tempZero,
    dependencies
  });
}

export function onChangeBorderRadiusUngrouped({
  v,
  device,
  state,
  value,
  current: _current,
  prefix = ""
}) {
  const current = capByPrefix(prefix, _current);
  const parent = capByPrefix(prefix, "borderRadius");
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ].map(child => capByPrefix(prefix, child));
  const temp = true;
  const tempZero = true;

  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * borderTopLeftRadius: borderTopLeftRadius,
     *
     * tempBorderTopLeftRadius: borderTopLeftRadius,
     */
    ...onChangeUngroupedByUngrouped({
      v,
      device,
      childs,
      state,
      current,
      value,
      temp
    }),

    /**
     * ### OUTPUT EXAMPLE
     *
     * borderRadius:
     *  borderTopLeftRadius === v.borderTopRightRadius &&
     *  borderTopLeftRadius === v.borderBottomRightRadius &&
     *  borderTopLeftRadius === v.borderBottomLeftRadius
     *    ? borderTopLeftRadius
     *    : borderTopLeftRadius > 0
     *      ? v.tempBorderRadius
     *      : v.borderRadius,
     *
     * tempBorderRadius:
     *  borderTopLeftRadius === v.borderTopRightRadius &&
     *  borderTopLeftRadius === v.borderBottomRightRadius &&
     *  borderTopLeftRadius === v.borderBottomLeftRadius
     *    ? borderTopLeftRadius
     *    : v.borderRadius,
     */
    ...onChangeGroupedByUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value,
      temp,
      tempZero
    })
  };
}

export function onChangeBorderRadiusUngroupedDependencies({
  v,
  device,
  state,
  value,
  current: _current,
  prefix = ""
}) {
  const current = capByPrefix(prefix, _current);
  const parent = capByPrefix(prefix, "borderRadius");
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ].map(child => capByPrefix(prefix, child));
  const borderWidthChilds = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ].map(child => capByPrefix(prefix, child));

  const dependencies = {
    borderStyle: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderWidth: {
      childs: borderWidthChilds,
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderColorOpacity: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderColorPalette: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    }
  };

  return {
    // Asta trebuei de analizat si devazut ce facem cu ea ???
    /**
     * bgColorOpacity:
     *   value > 0 && v.borderColorOpacity === 0
     *     ? v.tempBgColorOpacity
     *     : v.bgColorOpacity
     */
    ...onChangeDependeciesUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value,
      dependencies
    })
  };
}
