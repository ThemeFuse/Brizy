import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeColorHexAndOpacity({
  v,
  state,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity = onChangeColorOpacity({
    v,
    state,
    opacity,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd
      ? opacity
      : defaultValueValue({ v, key: "tempColorOpacity", state });

  return {
    [defaultValueKey({ key: "colorHex", state })]: hex,
    [defaultValueKey({ key: "colorOpacity", state })]: opacity,
    [defaultValueKey({
      key: "tempColorOpacity",
      state
    })]: tempOpacity
  };
}

export function onChangeColorHexAndOpacityPalette({
  v,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeColorOpacity({
    v,
    state,
    opacity,
    isChanged
  });

  const palette =
    isChanged === "hex" || opacity === 0
      ? ""
      : opacity > 0
      ? defaultValueValue({ v, key: "tempColorPalette", state })
      : defaultValueValue({ v, key: "colorPalette", state });

  const tempPalette =
    isChanged === "hex"
      ? ""
      : defaultValueValue({ v, key: "tempColorPalette", state });

  return {
    [defaultValueKey({ key: "colorPalette", state })]: palette,
    [defaultValueKey({
      key: "tempColorPalette",
      state
    })]: tempPalette
  };
}

export function onChangeColorPalette({ state, palette }) {
  return {
    [defaultValueKey({ key: "colorPalette", state })]: palette,
    [defaultValueKey({
      key: "tempColorPalette",
      state
    })]: palette
  };
}

export function onChangeColorPaletteOpacity({
  v,
  state,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity = onChangeColorOpacity({
    v,
    state,
    opacity,
    isChanged
  });

  return {
    [defaultValueKey({ key: "colorOpacity", state })]: opacity
  };
}

function onChangeColorOpacity({ v, state, opacity, isChanged }) {
  return isChanged === "hex" &&
    defaultValueValue({ v, key: "colorOpacity", state }) === 0
    ? defaultValueValue({ v, key: "tempColorOpacity", state })
    : opacity === undefined
    ? defaultValueValue({ v, key: "colorOpacity", state })
    : opacity;
}
