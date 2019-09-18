import { defaultValueValue } from "visual/utils/onChange";

export function styleHoverTransition({ v, device, state }) {
  const hoverTransition = defaultValueValue({
    v,
    key: "hoverTransition",
    device,
    state
  });

  return hoverTransition;
}
