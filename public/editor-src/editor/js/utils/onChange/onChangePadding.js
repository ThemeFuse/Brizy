import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped
} from "./onChange";

export function onChangePaddingGrouped({
  v,
  device,
  state,
  childs = undefined,
  value,
  suffix
}) {
  /**
   * ### OUTPUT EXAMPLE
   *
   * [paddingTopSuffix, paddingRightSuffix, paddingBottomSuffix, paddingLeftSuffix]
   */
  const parent = "padding";
  childs =
    childs === undefined
      ? ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
      : childs;

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
    ...onChangeGroupedAndUngroupedByGrouped({
      v,
      device,
      state,
      parent: `${parent}Suffix`,
      childs: childsSuffix,
      value: suffix
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
    ...onChangeGroupedAndUngroupedByGrouped({
      v,
      device,
      state,
      parent,
      childs,
      value
    })
  };
}

export function onChangePaddingUngrouped({
  v,
  device,
  state,
  current,
  value,
  suffix
}) {
  /**
   * ### OUTPUT EXAMPLE
   *
   * [paddingTopSuffix, paddingRightSuffix, paddingBottomSuffix, paddingLeftSuffix]
   */
  const parent = "padding";
  const childs = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];

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
    [`${current}Suffix`]: suffix,

    /**
     * ### OUTPUT EXAMPLE
     *
     * paddingTop
     * */
    ...onChangeUngroupedByUngrouped({
      v,
      device,
      state,
      childs,
      current,
      value
    }),

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
    ...onChangeGroupedByUngrouped({
      v,
      device,
      state,
      parent,
      childs,
      current,
      value
    }),

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
    ...onChangeGroupedByUngrouped({
      v,
      device,
      state,
      parent: `${parent}Suffix`,
      childs: childsSuffix,
      current: `${current}Suffix`,
      value: suffix
    })
  };
}
