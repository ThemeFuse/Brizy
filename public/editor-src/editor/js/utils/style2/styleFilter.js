import { capByPrefix } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleFilterBrightness({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "brightness"));
}
export function styleFilterHue({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "hue"));
}
export function styleFilterSaturation({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "saturation"));
}
export function styleFilterContrast({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "contrast"));
}

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;
