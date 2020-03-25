import { onChangeMeGrouped, onChangeMeUngrouped } from "./onChange";
import { capByPrefix } from "visual/utils/string";

export function onChangePaddingGrouped({
  v,
  device,
  state,
  me = "padding",
  childs: _childs,
  value,
  suffix,
  sliderDragEnd,
  prefix = ""
}) {
  const childs = [];
  const childsSuffix = [];
  const mePadding = capByPrefix(prefix, me);

  _childs.forEach(child => {
    const childPref = capByPrefix(prefix, child);

    childs.push(childPref);
    childsSuffix.push(capByPrefix(childPref, "suffix"));
  });

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
      me: `${mePadding}Suffix`,
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
      childs,
      value,
      me: mePadding,
      dragEnd: sliderDragEnd
    })
  };
}

export function onChangePaddingUngrouped({
  v,
  device,
  state,
  value,
  suffix,
  sliderDragEnd,
  childs: _childs,
  current: _current,
  me = "padding",
  prefix = ""
}) {
  const childs = [];
  const childsSuffix = [];
  const mePadding = capByPrefix(prefix, me);
  const current = capByPrefix(prefix, _current);

  _childs.forEach(child => {
    const childPref = capByPrefix(prefix, child);

    childs.push(childPref);
    childsSuffix.push(capByPrefix(childPref, "suffix"));
  });

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
      me: `${mePadding}Suffix`,
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
      childs,
      current,
      value,
      me: mePadding,
      dragEnd: sliderDragEnd
    })
  };
}
