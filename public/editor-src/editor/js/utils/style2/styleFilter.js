import { defaultValueValue } from "visual/utils/onChange";

export function styleFilterBrightness({ v, device, state }) {
  const brightness = defaultValueValue({ v, key: "brightness", device, state });

  return brightness;
}
export function styleFilterHue({ v, device, state }) {
  const hue = defaultValueValue({ v, key: "hue", device, state });

  return hue;
}
export function styleFilterSaturation({ v, device, state }) {
  const saturation = defaultValueValue({ v, key: "saturation", device, state });

  return saturation;
}
export function styleFilterContrast({ v, device, state }) {
  const contrast = defaultValueValue({ v, key: "contrast", device, state });

  return contrast;
}
