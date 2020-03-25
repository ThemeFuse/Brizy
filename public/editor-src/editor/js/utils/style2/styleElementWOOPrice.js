import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOPriceColumn({ v, device, state }) {
  const column = defaultValueValue({ v, key: "column", device, state });
  return column;
}

export function styleElementWOOPriceSpacing({ v, device, state }) {
  const spacing = defaultValueValue({ v, key: "spacing", device, state });
  return spacing;
}