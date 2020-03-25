import { defaultValueValue } from "visual/utils/onChange";

export function styleElementSwitcherSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("navStyle2Size");
}

export function styleElementSwitcherSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementSwitcherWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("navStyle1Width");
}
