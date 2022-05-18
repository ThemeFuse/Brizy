import { defaultValueValue } from "visual/utils/onChange";

export function styleIconSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("iconSpacing");
}
