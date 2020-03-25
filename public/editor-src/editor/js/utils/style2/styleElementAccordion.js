import { defaultValueValue } from "visual/utils/onChange";

export function styleElementAccordionSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("spacing");
}

export function styleElementAccordionFilterSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("filterSpacing");
}

export function styleElementAccordionFilterAfterSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("afterFilterSpacing");
}

export function styleElementAccordionNavAlign({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("horizontalAlign");
}
