import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOAdditionalSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementWOOAdditionalBorderWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("borderWidth");
}
