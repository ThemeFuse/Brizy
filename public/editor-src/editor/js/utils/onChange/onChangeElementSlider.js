import { capitalize } from "visual/utils/string";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeSliderColorHexAndOpacity({
  v,
  device,
  state,
  prefix,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const upperPrefix = capitalize(prefix);

  opacity = onChangeSliderColorOpacity({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({
          v,
          key: `temp${upperPrefix}ColorOpacity`,
          device,
          state
        });

  return {
    [defaultValueKey({ key: `${prefix}ColorHex`, device, state })]: hex,
    [defaultValueKey({
      key: `${prefix}ColorOpacity`,
      device,
      state
    })]: opacity,
    [defaultValueKey({
      key: `temp${upperPrefix}ColorOpacity`,
      device,
      state
    })]: tempOpacity
  };
}

export function onChangeSliderColorHexAndOpacityPalette({
  v,
  device,
  state,
  prefix,
  opacity = undefined,
  isChanged = "hex"
}) {
  const upperPrefix = capitalize(prefix);

  opacity = onChangeSliderColorOpacity({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({
          v,
          key: `temp${upperPrefix}ColorPalette`,
          device,
          state
        })
      : defaultValueValue({ v, key: `${prefix}ColorPalette`, device, state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({
          v,
          key: `temp${upperPrefix}ColorPalette`,
          device,
          state
        });

  return {
    [defaultValueKey({
      key: `${prefix}ColorPalette`,
      device,
      state
    })]: palette,
    [defaultValueKey({
      key: `temp${upperPrefix}ColorPalette`,
      device,
      state
    })]: tempPalette
  };
}

export function onChangeSliderColorPalette({ device, state, prefix, palette }) {
  const upperPrefix = capitalize(prefix);

  return {
    [defaultValueKey({
      key: `${prefix}ColorPalette`,
      device,
      state
    })]: palette,
    [defaultValueKey({
      key: `temp${upperPrefix}ColorPalette`,
      device,
      state
    })]: palette
  };
}

export function onChangeSliderColorPaletteOpacity({
  v,
  device,
  state,
  prefix,
  opacity = undefined,
  isChanged = "hex"
}) {
  const upperPrefix = capitalize(prefix);

  opacity = onChangeSliderColorOpacity({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  return {
    [defaultValueKey({ key: `${prefix}ColorOpacity`, device, state })]: opacity
  };
}

function onChangeSliderColorOpacity({
  v,
  device,
  state = "normal",
  prefix,
  opacity,
  isChanged
}) {
  const upperPrefix = capitalize(prefix);

  return isChanged === "hex" &&
    defaultValueValue({ v, key: `${prefix}ColorOpacity`, device, state }) === 0
    ? defaultValueValue({
        v,
        key: `temp${upperPrefix}ColorOpacity`,
        device,
        state
      })
    : opacity === undefined
    ? defaultValueValue({ v, key: `${prefix}ColorOpacity`, device, state })
    : opacity;
}
