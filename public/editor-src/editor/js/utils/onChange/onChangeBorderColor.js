// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el
import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeBorderColorHexAndOpacity({
  v,
  device,
  state,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity = onChangeBorderColorOpacity({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({ v, key: "tempBorderColorOpacity", device, state });

  return {
    [defaultValueKey({ key: "borderColorHex", device, state })]: hex,
    [defaultValueKey({ key: "borderColorOpacity", device, state })]: opacity,
    [defaultValueKey({
      key: "tempBorderColorOpacity",
      device,
      state
    })]: tempOpacity
  };
}

export function onChangeBorderColorHexAndOpacityPalette({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBorderColorOpacity({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({ v, key: "tempBorderColorPalette", device, state })
      : defaultValueValue({ v, key: "borderColorPalette", device, state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({ v, key: "tempBorderColorPalette", device, state });

  return {
    [defaultValueKey({ key: "borderColorPalette", device, state })]: palette,
    [defaultValueKey({
      key: "tempBorderColorPalette",
      device,
      state
    })]: tempPalette
  };
}

export function onChangeBorderColorHexAndOpacityDependencies({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  /**
   * ### OUTPUT EXAMPLE
   *
   * borderWidth:
   *   borderColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderWidth
   *       : v.borderWidth,
   *
   * borderTopWidth:
   *   borderColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderTopWidth
   *       : v.borderTopWidth,
   *
   * borderRightWidth:
   *   borderColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderRightWidth
   *       : v.borderRightWidth,
   *
   * borderBottomWidth:
   *   borderColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderBottomWidth
   *       : v.borderBottomWidth,
   *
   * borderLeftWidth:
   *   borderColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderLeftWidth
   *       : v.borderLeftWidth,
   */
  /**
   * borderRadius:
   *   borderColorOpacity === 0 && v.bgColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderRadius
   *       : v.borderRadius,
   *
   * borderTopLeftRadius:
   *   borderColorOpacity === 0 && v.bgColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderTopLeftRadius
   *       : v.borderTopLeftRadius,
   *
   * borderTopRightRadius:
   *   borderColorOpacity === 0 && v.bgColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderTopRightRadius
   *       : v.borderTopRightRadius,
   *
   * borderBottomRightRadius:
   *   borderColorOpacity === 0 && v.bgColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderBottomRightRadius
   *       : v.borderBottomRightRadius,
   *
   * borderBottomLeftRadius:
   *   borderColorOpacity === 0 && v.bgColorOpacity === 0
   *     ? 0
   *     : borderColorOpacity > 0
   *       ? v.tempBorderBottomLeftRadius
   *       : v.borderBottomLeftRadius,
   */

  const dependencies = {
    borderStyle: {
      childs: [],
      nullValue: [],
      tempValue: []
    },
    borderWidth: {
      childs: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth"
      ],
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
    }
  };

  opacity = onChangeBorderColorOpacity({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: opacity,
    dependencies
  });
}

export function onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet({
  v,
  device,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBorderColorOpacity({
    v,
    device,
    opacity,
    isChanged
  });

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

export function onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile({
  v,
  device,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBorderColorOpacity({
    v,
    device,
    opacity,
    isChanged
  });

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

export function onChangeBorderColorPalette({ device, state, palette }) {
  return {
    [defaultValueKey({ key: "borderColorPalette", device, state })]: palette,
    [defaultValueKey({
      key: "tempBorderColorPalette",
      device,
      state
    })]: palette
  };
}

export function onChangeBorderColorPaletteOpacity({
  v,
  device,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeBorderColorOpacity({
    v,
    device,
    state,
    opacity,
    isChanged
  });

  return {
    [defaultValueKey({ key: "borderColorOpacity", device, state })]: opacity
  };
}

function onChangeBorderColorOpacity({
  v,
  device,
  state = "normal",
  opacity,
  isChanged
}) {
  return isChanged === "hex" &&
    defaultValueValue({ v, key: "borderColorOpacity", device, state }) === 0
    ? defaultValueValue({ v, key: "tempBorderColorOpacity", device, state })
    : opacity === undefined
    ? defaultValueValue({ v, key: "borderColorOpacity", device, state })
    : opacity;
}
