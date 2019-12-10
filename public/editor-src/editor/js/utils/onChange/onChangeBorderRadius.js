// ToDo.. La Border Radius de ce se activeaza BG si nu Border din valoarea 0????

import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped,
  onChangeDependeciesGrouped,
  onChangeDependeciesUngrouped
} from "./onChange";

export function onChangeBorderRadiusGrouped({
  v,
  device,
  state,
  value,
  sliderDragEnd
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

  const parent = "borderRadius";
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ];
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
  value
}) {
  // ToDo..
  // Asta trebuei de analizat si devazut ce facem cu ea ???
  /**
   * bgColorOpacity:
   *   value > 0 && v.borderColorOpacity === 0
   *     ? v.tempBgColorOpacity
   *     : v.bgColorOpacity
   */
  const tempZero = true;
  const dependencies = {
    borderStyle: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderWidth: {
      childs: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth"
      ],
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
  current,
  value
}) {
  const parent = "borderRadius";
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ];
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
    ...onChangeUngroupedByUngrouped({ v, childs, state, current, value, temp }),

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
  current,
  value
}) {
  const parent = "borderRadius";
  const childs = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ];

  const dependencies = {
    borderStyle: {
      childs: [],
      tempValue: ["bgColorOpacity", "bgImageSrc"]
    },
    borderWidth: {
      childs: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth"
      ],
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
