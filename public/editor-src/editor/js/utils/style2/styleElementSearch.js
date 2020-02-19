import { defaultValueValue } from "visual/utils/onChange";

export function styleElementSearchMinWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("openButtonWidth");
}

export function styleElementSearchMinHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("openButtonHeight");
}
