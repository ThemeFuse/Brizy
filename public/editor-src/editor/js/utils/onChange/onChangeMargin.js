import {
  onChangeGroupedAndUngroupedByGrouped,
  onChangeUngroupedByUngrouped,
  onChangeGroupedByUngrouped
} from "./onChange";
import { defaultValueKey } from "./device";

export function onChangeMarginGrouped({ v, device, state, value, suffix }) {
  const parent = "margin";
  const childs = ["marginTop", "marginRight", "marginBottom", "marginLeft"];

  const childsSuffix = [];
  for (var i = 0; i < childs.length; i++) {
    childsSuffix[i] = `${childs[i]}Suffix`;
  }
  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * marginSuffix: suffix,
     * marginTopSuffix: suffix,
     * marginRightSuffix: suffix,
     * marginBottomSuffix: suffix,
     * marginLeftSuffix: suffix
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
     * margin,
     * marginTop: margin,
     * marginRight: margin,
     * marginBottom: margin,
     * marginLeft: margin
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

export function onChangeMarginUngrouped({
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
   * [marginTopSuffix, marginRightSuffix, marginBottomSuffix, marginLeftSuffix]
   */

  const parent = "margin";
  const childs = ["marginTop", "marginRight", "marginBottom", "marginLeft"];

  const childsSuffix = [];
  for (var i = 0; i < childs.length; i++) {
    childsSuffix[i] = `${childs[i]}Suffix`;
  }
  return {
    /**
     * ### OUTPUT EXAMPLE
     *
     * marginTopSuffix,
     */
    [`${defaultValueKey({
      key: `${current}Suffix`,
      device,
      state
    })}`]: suffix,

    /**
     * ### OUTPUT EXAMPLE
     *
     * marginTop
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
     * margin:
     *  marginTop === v.marginRight &&
     *  marginTop === v.marginLeft &&
     *  marginTop === v.marginBottom
     *    ? marginTop
     *    : v.margin
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
     * marginSuffix:
     *  marginTopSuffix === v.marginRightSuffix &&
     *  marginTopSuffix === v.marginLeftSuffix &&
     *  marginTopSuffix === v.marginBottomSuffix
     *    ? marginTopSuffix
     *    : v.marginSuffix
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
