import { capByPrefix, capitalize } from "visual/utils/string";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeColorHexAndOpacity({
  v,
  device,
  state,
  prefix = "color",
  hex,
  opacity,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  opacity = onChangeColorOpacity({
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
      : dvv(capByPrefix(tempPrefix, "opacity"));

  return {
    [dvk(capByPrefix(prefix, "hex"))]: hex,
    [dvk(capByPrefix(prefix, "opacity"))]: opacity,
    [dvk(capByPrefix(tempPrefix, "opacity"))]: tempOpacity
  };
}

export function onChangeColorHexAndOpacityPalette({
  v,
  device,
  state,
  prefix = "color",
  opacity,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  opacity = onChangeColorOpacity({
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
      ? dvv(capByPrefix(tempPrefix, "palette"))
      : dvv(capByPrefix(prefix, "palette"));

  const tempPalette =
    isChanged === "hex" ? "" : dvv(capByPrefix(tempPrefix, "palette"));

  return {
    [dvk(capByPrefix(prefix, "palette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "palette"))]: tempPalette
  };
}

export function onChangeColorPalette({
  device,
  state,
  prefix = "color",
  palette
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  return {
    [dvk(capByPrefix(prefix, "palette"))]: palette,
    [dvk(capByPrefix(tempPrefix, "palette"))]: palette
  };
}

export function onChangeColorPaletteOpacity({
  v,
  device,
  state,
  prefix = "color",
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  opacity = onChangeColorOpacity({
    v,
    device,
    state,
    prefix,
    opacity,
    isChanged
  });

  return {
    [dvk(capByPrefix(prefix, "opacity"))]: opacity
  };
}

function onChangeColorOpacity({
  v,
  device,
  state,
  prefix = "color",
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const tempPrefix = `temp${capitalize(prefix)}`;

  return isChanged === "hex" && dvv(capByPrefix(prefix, "opacity")) === 0
    ? dvv(capByPrefix(tempPrefix, "opacity"))
    : opacity === undefined
    ? dvv(capByPrefix(prefix, "opacity"))
    : opacity;
}
