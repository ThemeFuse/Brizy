import { defaultValueValue } from "visual/utils/onChange";

export function styleElementMediaIconCustomSize({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "iconCustomSize",
    device,
    state
  });
}
