import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOAttributesSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementWOOAttributesBetween({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("between");
}

export function styleElementWOOAttributesStyleBorder({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("style");
}
