import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped,
  onChangeDependeciesGrouped,
  onChangeDependeciesUngrouped
} from "./onChange";

export function onChangeBorderWidthGrouped({
  v,
  device,
  state,
  value,
  sliderDragEnd
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];
  const temp = true;
  const tempZero = false;

  /**
   * ### OUTPUT EXAMPLE
   *
   * borderWidth,
   * borderTopWidth: borderWidth,
   * borderRightWidth: borderWidth,
   * borderBottomWidth: borderWidth,
   * borderLeftWidth: borderWidth,
   *
   * tempBorderWidth: sliderDragEnd
   *  borderWidth > 0 && sliderDragEnd
   *    ? borderWidth
   *    : v.tempBorderWidth,
   *
   * tempBorderTopWidth:
   *  borderWidth > 0 && sliderDragEnd
   *    ? borderWidth
   *    : v.tempBorderTopWidth,
   *
   * tempBorderRightWidth:
   *  borderWidth > 0 && sliderDragEnd
   *    ? borderWidth
   *    : v.tempBorderRightWidth,
   *
   * tempBorderBottomWidth:
   *  borderWidth > 0 && sliderDragEnd
   *    ? borderWidth
   *      : v.tempBorderBottomWidth,
   *
   * tempBorderLeftWidth:
   *  borderWidth > 0 && sliderDragEnd
   *    ? borderWidth
   *    : v.tempBorderLeftWidth,
   */
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

export function onChangeBorderWidthGroupedDependencies({
  v,
  device,
  state,
  value
}) {
  /**
   * ### OUTPUT EXAMPLE
   *
   * borderColorOpacity:
   *   value === 0
   *     ? 0
   *     : value > 0
   *       ? v.tempBorderColorOpacity
   *       : v.borderColorOpacity,
   *
   * ---------------------------
   * ToDo. De aici in jos nu stiu daca ii corect trebuei de verificat
   *
   * borderRadius:
   *  value === 0 && v.bgColorOpacity === 0
   *    ? 0
   *    : value > 0
   *      ? v.tempBorderRadius
   *      : v.borderRadius,
   *
   * ToDo.. ## nu sunt sigur ca astea de jos e nevoie de ele
   *
   * borderTopLeftRadius:
   *  value === 0 && v.bgColorOpacity === 0
   *    ? 0
   *    : value > 0 &&
   *      v.borderTopRightRadius === 0 &&
   *      v.borderBottomRightRadius === 0 &&
   *      v.borderBottomLeftRadius === 0
   *        ? v.tempBorderTopLeftRadius
   * :      v.borderTopLeftRadius,
   *
   * borderTopRightRadius:
   *  value === 0 && v.bgColorOpacity === 0
   *    ? 0
   *    : value > 0 &&
   *      v.borderTopLeftRadius === 0 &&
   *      v.borderBottomRightRadius === 0 &&
   *      v.borderBottomLeftRadius === 0
   *        ? v.tempBorderTopRightRadius
   *        : v.borderTopRightRadius,
   *
   * borderBottomLeftRadius:
   *  value === 0 && v.bgColorOpacity === 0
   *    ? 0
   *    : value > 0 &&
   *      v.borderTopLeftRadius === 0 &&
   *      v.borderTopRightRadius === 0 &&
   *      v.borderBottomRightRadius === 0
   *        ? v.tempBorderBottomLeftRadius
   *        : v.borderBottomLeftRadius,
   *
   * borderBottomRightRadius:
   *  value === 0 && v.bgColorOpacity === 0
   *    ? 0
   *    : value > 0 &&
   *      v.borderTopLeftRadius === 0 &&
   *      v.borderTopRightRadius === 0 &&
   *      v.borderBottomLeftRadius === 0
   *        ? v.tempBorderBottomRightRadius
   *        : v.borderBottomRightRadius
   */
  const dependencies = {
    borderStyle: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
      tempValue: []
    },
    borderColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value,
    dependencies
  });
}

export function onChangeBorderWidthUngrouped({
  v,
  device,
  state,
  current,
  value,
  sliderDragEnd
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];
  const temp = true;

  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * borderTopWidth,
     *
     * tempBorderTopWidth: borderTopWidth,
     */
    ...onChangeUngroupedByUngrouped({
      v,
      device,
      state,
      childs,
      current,
      value,
      temp
    }),

    /**
     * borderWidth:
     *   borderTopWidth === v.borderRightWidth &&
     *   borderTopWidth === v.borderBottomWidth &&
     *   borderTopWidth === v.borderLeftWidth
     *     ? borderTopWidth
     *     : borderTopWidth > 0
     *        ? v.tempBorderWidth
     *        : v.borderWidth,
     *
     * tempBorderWidth:
     *   sliderDragEnd &&
     *   borderTopWidth === v.borderRightWidth &&
     *   borderTopWidth === v.borderBottomWidth &&
     *   borderTopWidth === v.borderLeftWidth
     *     ? borderTopWidth
     *     : v.tempBorderWidth,
     */
    ...onChangeGroupedByUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value,
      temp
    })
  };
}

export function onChangeBorderWidthUngroupedDependencies({
  v,
  device,
  state,
  current,
  value
}) {
  const parent = "borderWidth";
  const childs = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth"
  ];

  const dependencies = {
    borderStyle: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgColorOpacity", "bgImageSrc"],
      tempValue: []
    },
    borderColorOpacity: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderColorPalette: {
      childs: [],
      nullValue: [],
      tempValue: []
    }
  };

  return {
    /*
    borderColorOpacity:
      borderTopWidth === 0 &&
      v.borderRightWidth === 0 &&
      v.borderBottomWidth === 0 &&
      v.borderLeftWidth === 0
        ? 0
        : borderTopWidth > 0
          ? v.tempBorderColorOpacity
          : v.borderColorOpacity*/

    /**
     * ### OUTPUT EXAMPLE
     *
     * borderColorOpacity:
     *   value === 0
     *     ? 0
     *     : value > 0
     *       ? v.tempBorderColorOpacity
     *       : v.borderColorOpacity,
     *
     * ---------------------------
     * ToDo. De aici in jos nu stiu daca ii corect trebuei de verificat
     *
     * borderRadius:
     *  value === 0 && v.bgColorOpacity === 0
     *    ? 0
     *    : value > 0
     *      ? v.tempBorderRadius
     *      : v.borderRadius,
     *
     * ToDo.. ## nu sunt sigur ca astea de jos e nevoie de ele
     *
     * borderTopLeftRadius:
     *  value === 0 && v.bgColorOpacity === 0
     *    ? 0
     *    : value > 0 &&
     *      v.borderTopRightRadius === 0 &&
     *      v.borderBottomRightRadius === 0 &&
     *      v.borderBottomLeftRadius === 0
     *        ? v.tempBorderTopLeftRadius
     * :      v.borderTopLeftRadius,
     *
     * borderTopRightRadius:
     *  value === 0 && v.bgColorOpacity === 0
     *    ? 0
     *    : value > 0 &&
     *      v.borderTopLeftRadius === 0 &&
     *      v.borderBottomRightRadius === 0 &&
     *      v.borderBottomLeftRadius === 0
     *        ? v.tempBorderTopRightRadius
     *        : v.borderTopRightRadius,
     *
     * borderBottomLeftRadius:
     *  value === 0 && v.bgColorOpacity === 0
     *    ? 0
     *    : value > 0 &&
     *      v.borderTopLeftRadius === 0 &&
     *      v.borderTopRightRadius === 0 &&
     *      v.borderBottomRightRadius === 0
     *        ? v.tempBorderBottomLeftRadius
     *        : v.borderBottomLeftRadius,
     *
     * borderBottomRightRadius:
     *  value === 0 && v.bgColorOpacity === 0
     *    ? 0
     *    : value > 0 &&
     *      v.borderTopLeftRadius === 0 &&
     *      v.borderTopRightRadius === 0 &&
     *      v.borderBottomLeftRadius === 0
     *        ? v.tempBorderBottomRightRadius
     *        : v.borderBottomRightRadius
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
