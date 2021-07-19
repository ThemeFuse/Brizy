import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleTextShadowType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "textShadow"));
}

export function styleTextShadowColor({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const colorHex = capByPrefix(textShadow, "colorHex");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return hexToRgba(hex, dvv(colorOpacity));
}

export function styleTextShadowHorizontal({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "horizontal"));
}

export function styleTextShadowVertical({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "vertical"));
}

export function styleTextShadowBlur({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "blur"));
}
