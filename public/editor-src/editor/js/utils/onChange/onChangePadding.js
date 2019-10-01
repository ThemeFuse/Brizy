import { onChangeMeGrouped, onChangeMeUngrouped } from "./onChange";

export function onChangePaddingGrouped({
  v,
  device,
  state,
  me = "padding",
  childs,
  value,
  suffix,
  sliderDragEnd
}) {
  const childsSuffix = [];

  for (var i = 0; i < childs.length; i++) {
    childsSuffix[i] = `${childs[i]}Suffix`;
  }

  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * paddingSuffix: suffix,
     * paddingTopSuffix: suffix,
     * paddingRightSuffix: suffix,
     * paddingBottomSuffix: suffix,
     * paddingLeftSuffix: suffix
     */
    ...onChangeMeGrouped({
      v,
      device,
      state,
      me: `${me}Suffix`,
      childs: childsSuffix,
      value: suffix,
      dragEnd: sliderDragEnd
    }),

    /**
     * ### OUTPUT EXAMPLE
     *
     * padding,
     * paddingTop: padding,
     * paddingRight: padding,
     * paddingBottom: padding,
     * paddingLeft: padding
     */
    ...onChangeMeGrouped({
      v,
      device,
      state,
      me,
      childs,
      value,
      dragEnd: sliderDragEnd
    })
  };
}

export function onChangePaddingUngrouped({
  v,
  device,
  state,
  me = "padding",
  current,
  childs,
  value,
  suffix,
  sliderDragEnd
}) {
  const childsSuffix = [];

  for (var i = 0; i < childs.length; i++) {
    childsSuffix[i] = `${childs[i]}Suffix`;
  }

  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * paddingTopSuffix,
     */
    /**
     * ### OUTPUT EXAMPLE
     *
     * paddingSuffix:
     *  paddingTopSuffix === v.paddingRightSuffix &&
     *  paddingTopSuffix === v.paddingLeftSuffix &&
     *  paddingTopSuffix === v.paddingBottomSuffix
     *    ? paddingTopSuffix
     *    : v.paddingSuffix
     * */

    ...onChangeMeUngrouped({
      v,
      device,
      state,
      me: `${me}Suffix`,
      childs: childsSuffix,
      current: `${current}Suffix`,
      value: suffix,
      dragEnd: sliderDragEnd
    }),

    /**
     * ### OUTPUT EXAMPLE
     *
     * paddingTop
     * */
    /**
     * ### OUTPUT EXAMPLE
     *
     * padding:
     *  paddingTop === v.paddingRight &&
     *  paddingTop === v.paddingLeft &&
     *  paddingTop === v.paddingBottom
     *    ? paddingTop
     *    : v.padding
     * */
    ...onChangeMeUngrouped({
      v,
      device,
      state,
      me,
      childs,
      current,
      value,
      dragEnd: sliderDragEnd
    })
  };
}
