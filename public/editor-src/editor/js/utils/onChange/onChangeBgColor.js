import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeBgColorHexAndOpacity({
  v,
  device,
  state,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity = onChangeBgColorOpacity({ v, device, state, opacity, isChanged });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({ v, key: "tempBgColorOpacity", device, state });
  return {
    [defaultValueKey({ key: "bgColorHex", device, state })]: hex,
    [defaultValueKey({ key: "bgColorOpacity", device, state })]: opacity,
    [defaultValueKey({
      key: "tempBgColorOpacity",
      device,
      state
    })]: tempOpacity
  };
}

export function onChangeBgColorHexAndOpacityPalette({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  
  opacity = onChangeBgColorOpacity({ v, device, state, opacity, isChanged });
  
  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({ v, key: "tempBgColorPalette", device, state })
      : defaultValueValue({ v, key: "bgColorPalette", device, state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({ v, key: "tempBgColorPalette", device, state });

  return {
    [defaultValueKey({ key: "bgColorPalette", device, state })]: palette,
    [defaultValueKey({ key: "tempBgColorPalette", device, state })]: tempPalette
  };
}

export function onChangeBgColorHexAndOpacityDependencies({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  /**
   * borderRadius:
   *   bgColorOpacity === 0 && v.borderColorOpacity === 0 && v.bgImageSrc === ""
   *     ? 0
   *     : bgColorOpacity > 0
   *       ? v.tempBorderRadius
   *       : v.borderRadius,
   *
   * borderTopLeftRadius:
   *   bgColorOpacity === 0 && v.borderColorOpacity === 0 && v.bgImageSrc === ""
   *     ? 0
   *     : bgColorOpacity > 0
   *       ? v.tempBorderTopLeftRadius
   *       : v.borderTopLeftRadius,
   *
   * borderTopRightRadius:
   *   bgColorOpacity === 0 && v.borderColorOpacity === 0 && v.bgImageSrc === ""
   *     ? 0
   *     : bgColorOpacity > 0
   *       ? v.tempBorderTopRightRadius
   *       : v.borderTopRightRadius,
   *
   * borderBottomRightRadius:
   *   bgColorOpacity === 0 && v.borderColorOpacity === 0 && v.bgImageSrc === ""
   *     ? 0
   *     : bgColorOpacity > 0
   *       ? v.tempBorderBottomRightRadius
   *       : v.borderBottomRightRadius,
   *
   * borderBottomLeftRadius:
   *   bgColorOpacity === 0 && v.borderColorOpacity === 0 && v.bgImageSrc === ""
   *     ? 0
   *     : bgColorOpacity > 0
   *       ? v.tempBorderBottomLeftRadius
   *       : v.borderBottomLeftRadius,
   */
  const dependencies = {
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgImageSrc", "borderColorOpacity"],
      tempValue: []
    }
  };

  opacity = onChangeBgColorOpacity({ v, device, state, opacity, isChanged });

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: opacity,
    dependencies
  });
}

export function onChangeBgColorHexAndOpacityColumnAndRowSyncTablet({
  v,
  device,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBgColorOpacity({ v, device, opacity, isChanged });

  const tabletPaddingRight =
    opacity === 0
      ? 0
      : isChanged === "hex" || opacity > 0
      ? v.tempTabletPaddingRight
      : v.tabletPaddingRight;

  const tabletPaddingLeft =
    opacity === 0
      ? 0
      : isChanged === "hex" || opacity > 0
      ? v.tempTabletPaddingLeft
      : v.tabletPaddingLeft;

  return {
    tabletPaddingRight,
    tabletPaddingLeft
  };
}

export function onChangeBgColorHexAndOpacityColumnAndRowSyncMobile({
  v,
  device,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBgColorOpacity({ v, device, opacity, isChanged });

  const mobilePaddingRight =
    opacity === 0
      ? 0
      : isChanged === "hex" || opacity > 0
      ? v.tempMobilePaddingRight
      : v.mobilePaddingRight;

  const mobilePaddingLeft =
    opacity === 0
      ? 0
      : isChanged === "hex" || opacity > 0
      ? v.tempMobilePaddingLeft
      : v.mobilePaddingLeft;

  return {
    mobilePaddingRight,
    mobilePaddingLeft
  };
}

export function onChangeBgColorPalette({ device, state, palette }) {
  return {
    [defaultValueKey({ key: "bgColorPalette", device, state })]: palette,
    [defaultValueKey({ key: "tempBgColorPalette", device, state })]: palette
  };
}

export function onChangeBgColorPaletteOpacity({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBgColorOpacity({ v, device, state, opacity, isChanged });

  return {
    [defaultValueKey({ key: "bgColorOpacity", device, state })]: opacity
  };
}

function onChangeBgColorOpacity({ v, device, state, opacity, isChanged }) {
  return isChanged === "hex" &&
    defaultValueValue({ v, key: "bgColorOpacity", device, state }) === 0 &&
    defaultValueValue({ v, key: "tempBgColorOpacity", device, state }) === 1 &&
    defaultValueValue({ v, key: "bgImageSrc", device, state }) !== ""
    ? 0.9
    : isChanged === "hex" &&
      defaultValueValue({ v, key: "bgColorOpacity", device, state }) === 0
    ? defaultValueValue({ v, key: "tempBgColorOpacity", device, state })
    : opacity === undefined
    ? defaultValueValue({ v, key: "bgColorOpacity", device, state })
    : opacity;
}
