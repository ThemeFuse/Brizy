import { capitalize } from "visual/utils/string";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeColorHexAndOpacity({
  v,
  state,
  prefix = "color",
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const upperPrefix = capitalize(prefix);

  opacity = onChangeColorOpacity({
    v,
    state,
    prefix,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({ v, key: `temp${upperPrefix}Opacity`, state });

  return {
    [defaultValueKey({ key: `${prefix}Hex`, state })]: hex,
    [defaultValueKey({ key: `${prefix}Opacity`, state })]: opacity,
    [defaultValueKey({
      key: `temp${upperPrefix}Opacity`,
      state
    })]: tempOpacity
  };
}

export function onChangeColorHexAndOpacityPalette({
  v,
  state,
  prefix = "color",
  opacity = undefined,
  isChanged = "hex"
}) {
  const upperPrefix = capitalize(prefix);

  opacity = onChangeColorOpacity({
    v,
    state,
    prefix,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({ v, key: `temp${upperPrefix}Palette`, state })
      : defaultValueValue({ v, key: `${prefix}Palette`, state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({ v, key: `temp${upperPrefix}Palette`, state });

  return {
    [defaultValueKey({ key: `${prefix}Palette`, state })]: palette,
    [defaultValueKey({
      key: `temp${upperPrefix}Palette`,
      state
    })]: tempPalette
  };
}

export function onChangeColorPalette({ state, prefix = "color", palette }) {
  const upperPrefix = capitalize(prefix);

  return {
    [defaultValueKey({ key: `${prefix}Palette`, state })]: palette,
    [defaultValueKey({
      key: `temp${upperPrefix}Palette`,
      state
    })]: palette
  };
}

export function onChangeColorPaletteOpacity({
  v,
  state,
  prefix = "color",
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeColorOpacity({
    v,
    state,
    prefix,
    opacity,
    isChanged
  });

  return {
    [defaultValueKey({ key: `${prefix}Opacity`, state })]: opacity
  };
}

function onChangeColorOpacity({
  v,
  state,
  prefix = "color",
  opacity,
  isChanged
}) {
  const upperPrefix = capitalize(prefix);

  return isChanged === "hex" &&
    defaultValueValue({ v, key: `${prefix}Opacity`, state }) === 0
    ? defaultValueValue({ v, key: `temp${upperPrefix}Opacity`, state })
    : opacity === undefined
    ? defaultValueValue({ v, key: `${prefix}Opacity`, state })
    : opacity;
}
