import { defaultValueValue } from "visual/utils/onChange";

export function styleHoverTransition({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "hoverTransition",
    device,
    state
  });
}
