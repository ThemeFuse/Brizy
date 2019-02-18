import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeElementProgressBarBg2ColorHexAndOpacity({
  v,
  device,
  state,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity = onChangeBg2ColorOpacity({ v, device, state, opacity, isChanged });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({ v, key: "tempBg2ColorOpacity", device, state });
  return {
    [defaultValueKey({ key: "bg2ColorHex", device, state })]: hex,
    [defaultValueKey({ key: "bg2ColorOpacity", device, state })]: opacity,
    [defaultValueKey({
      key: "tempBg2ColorOpacity",
      device,
      state
    })]: tempOpacity
  };
}

export function onChangeElementProgressBarBg2ColorHexAndOpacityPalette({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBg2ColorOpacity({ v, device, state, opacity, isChanged });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({ v, key: "tempBg2ColorPalette", device, state })
      : defaultValueValue({ v, key: "bg2ColorPalette", device, state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({ v, key: "tempBg2ColorPalette", device, state });

  return {
    [defaultValueKey({ key: "bg2ColorPalette", device, state })]: palette,
    [defaultValueKey({
      key: "tempBg2ColorPalette",
      device,
      state
    })]: tempPalette
  };
}

export function onChangeElementProgressBarBg2ColorHexAndOpacityDependencies({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  /**
   * borderRadius:
   *   bg2ColorOpacity === 0 && v.borderColorOpacity === 0 && v.bg2ImageSrc === ""
   *     ? 0
   *     : bg2ColorOpacity > 0
   *       ? v.tempBorderRadius
   *       : v.borderRadius,
   *
   * borderTopLeftRadius:
   *   bg2ColorOpacity === 0 && v.borderColorOpacity === 0 && v.bg2ImageSrc === ""
   *     ? 0
   *     : bg2ColorOpacity > 0
   *       ? v.tempBorderTopLeftRadius
   *       : v.borderTopLeftRadius,
   *
   * borderTopRightRadius:
   *   bg2ColorOpacity === 0 && v.borderColorOpacity === 0 && v.bg2ImageSrc === ""
   *     ? 0
   *     : bg2ColorOpacity > 0
   *       ? v.tempBorderTopRightRadius
   *       : v.borderTopRightRadius,
   *
   * borderBottomRightRadius:
   *   bg2ColorOpacity === 0 && v.borderColorOpacity === 0 && v.bg2ImageSrc === ""
   *     ? 0
   *     : bg2ColorOpacity > 0
   *       ? v.tempBorderBottomRightRadius
   *       : v.borderBottomRightRadius,
   *
   * borderBottomLeftRadius:
   *   bg2ColorOpacity === 0 && v.borderColorOpacity === 0 && v.bg2ImageSrc === ""
   *     ? 0
   *     : bg2ColorOpacity > 0
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
      nullValue: ["bg2ImageSrc", "borderColorOpacity"],
      tempValue: []
    }
  };

  opacity = onChangeBg2ColorOpacity({ v, device, state, opacity, isChanged });

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: opacity,
    dependencies
  });
}

export function onChangeElementProgressBarBg2ColorPalette({
  device,
  state,
  palette
}) {
  return {
    [defaultValueKey({ key: "bg2ColorPalette", device, state })]: palette,
    [defaultValueKey({ key: "tempBg2ColorPalette", device, state })]: palette
  };
}

export function onChangeElementProgressBarBg2ColorPaletteOpacity({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBg2ColorOpacity({ v, device, state, opacity, isChanged });

  return {
    [defaultValueKey({ key: "bg2ColorOpacity", device, state })]: opacity
  };
}

function onChangeBg2ColorOpacity({ v, device, state, opacity, isChanged }) {
  return isChanged === "hex" &&
    defaultValueValue({ v, key: "bg2ColorOpacity", device, state }) === 0 &&
    defaultValueValue({ v, key: "tempBg2ColorOpacity", device, state }) === 1 &&
    defaultValueValue({ v, key: "bg2ImageSrc", device, state }) !== ""
    ? 0.9
    : isChanged === "hex" &&
      defaultValueValue({ v, key: "bg2ColorOpacity", device, state }) === 0
    ? defaultValueValue({ v, key: "tempBg2ColorOpacity", device, state })
    : opacity === undefined
    ? defaultValueValue({ v, key: "bg2ColorOpacity", device, state })
    : opacity;
}
