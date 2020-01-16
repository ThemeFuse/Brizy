import { defaultValueValue } from "visual/utils/onChange";

export function styleZIndex({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("zIndex");
}
