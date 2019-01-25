import { defaultValueValue } from "visual/utils/onChange";

export function styleBorderRadius({ v, device, state, current }) {
  return defaultValueValue({ v, key: "borderRadiusType", device, state }) ===
    "grouped"
    ? `${defaultValueValue({ v, key: "borderRadius", device, state })}px`
    : `${defaultValueValue({ v, key: current, device, state })}px`;
}
