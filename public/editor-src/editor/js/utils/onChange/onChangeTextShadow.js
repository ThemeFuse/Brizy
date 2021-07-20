// ToDo.. De ce ColorFields accepta 2 valori HEX si Opacity eu cerd ca e nevoie doar de HEX opacity nu e nevoie de el

import { defaultValueValue, defaultValueKey } from "./device";
import { capByPrefix } from "visual/utils/string";

export function onChangeTextShadowType({
  v,
  device,
  state,
  textShadowType,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const tempTextShadow = capByPrefix("temp", textShadow);

  return {
    [dvk(textShadow)]: textShadowType,
    [dvk(tempTextShadow)]:
      textShadowType !== "" ? textShadowType : dvv(tempTextShadow)
  };
}

export function onChangeTextShadowHexAndOpacity({
  v,
  device,
  state,
  hex,
  opacity,
  prefix = "",
  isChanged = "hex",
  opacityDragEnd = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorHex = capByPrefix(textShadow, "colorHex");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  opacity = onChangeTextShadowOpacity({
    v,
    device,
    state,
    opacity,
    prefix,
    isChanged
  });

  const tempOpacity =
    opacity > 0 && opacityDragEnd ? opacity : dvv(tempColorOpacity);

  return {
    // is it ok?
    [dvk(textShadow)]: "shadow",
    [dvk(colorHex)]: hex,
    [dvk(colorOpacity)]: opacity,
    [dvk(tempColorOpacity)]: tempOpacity
  };
}

export function onChangeTextShadowHexAndOpacityPalette({
  v,
  device,
  state,
  opacity,
  prefix = "",
  isChanged = "hex"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

  opacity = onChangeTextShadowOpacity({
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
      ? dvv(tempColorPalette)
      : dvv(colorPalette);

  const tempPalette = isChanged === "hex" ? "" : dvv(tempColorPalette);

  return {
    // is it ok?
    [dvk(textShadow)]: "shadow",
    [dvk(colorPalette)]: palette,
    [dvk(tempColorPalette)]: tempPalette
  };
}

export function onChangeTextShadowPalette({
  device,
  state,
  palette,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const tempColorPalette = capByPrefix("temp", colorPalette);

  return {
    // is it ok?
    [dvk(textShadow)]: "shadow",
    [dvk(colorPalette)]: palette,
    [dvk(tempColorPalette)]: palette
  };
}

export function onChangeTextShadowPaletteOpacity({
  v,
  device,
  state,
  opacity,
  isChanged,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");

  opacity = onChangeTextShadowOpacity({
    v,
    device,
    state,
    opacity,
    prefix,
    isChanged
  });

  return {
    // is it ok?
    [dvk(textShadow)]: "shadow",
    [dvk(colorOpacity)]: opacity
  };
}

export function onChangeTextShadowFields({
  device,
  state,
  textShadowBlur = 0,
  textShadowVertical = 0,
  textShadowHorizontal = 0,
  prefix = ""
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const blur = capByPrefix(textShadow, "blur");
  const vertical = capByPrefix(textShadow, "vertical");
  const horizontal = capByPrefix(textShadow, "horizontal");
  const tempBlur = capByPrefix("temp", blur);
  const tempVertical = capByPrefix("temp", vertical);
  const tempHorizontal = capByPrefix("temp", horizontal);

  return {
    // is it ok?
    [dvk(textShadow)]: "shadow",
    [dvk(blur)]: textShadowBlur,
    [dvk(tempBlur)]: textShadowBlur,

    [dvk(vertical)]: textShadowVertical,
    [dvk(tempVertical)]: textShadowVertical,

    [dvk(horizontal)]: textShadowHorizontal,
    [dvk(tempHorizontal)]: textShadowHorizontal
  };
}

export function onChangeTextShadowOpacity({
  v,
  device,
  state,
  prefix = "",
  opacity = undefined,
  isChanged = "hex"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const tempColorOpacity = capByPrefix("temp", colorOpacity);

  return (isChanged === "hex" || isChanged === "palette") &&
    dvv(colorOpacity) === 0
    ? dvv(tempColorOpacity)
    : opacity === undefined
    ? dvv(colorOpacity)
    : opacity;
}
