import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleTextShadowType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "textShadow"));
}

export function styleTextShadowColor({
  v,
  device,
  state,
  getConfig,
  prefix = ""
}) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const textShadow = capByPrefix(prefix, "textShadow");
  const colorHex = dvv(capByPrefix(textShadow, "colorHex"));
  const colorOpacity = dvv(capByPrefix(textShadow, "colorOpacity"));
  const colorPalette = dvv(capByPrefix(textShadow, "colorPalette"));

  return getColor(colorPalette, colorHex, colorOpacity, config);
}

export function styleTextShadowHorizontal({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "horizontal"));
}

export function styleTextShadowVertical({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "vertical"));
}

export function styleTextShadowBlur({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const textShadow = capByPrefix(prefix, "textShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(textShadow, "blur"));
}
