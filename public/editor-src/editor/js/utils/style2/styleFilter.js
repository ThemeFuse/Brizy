import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleFilterBrightness({ v, device, state }) {
  state = getState(v, state);
  const brightness = defaultValueValue({ v, key: "brightness", device, state });

  return brightness;
}
export function styleFilterHue({ v, device, state }) {
  state = getState(v, state);
  const hue = defaultValueValue({ v, key: "hue", device, state });

  return hue;
}
export function styleFilterSaturation({ v, device, state }) {
  state = getState(v, state);
  const saturation = defaultValueValue({ v, key: "saturation", device, state });

  return saturation;
}
export function styleFilterContrast({ v, device, state }) {
  state = getState(v, state);
  const contrast = defaultValueValue({ v, key: "contrast", device, state });

  return contrast;
}

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;
