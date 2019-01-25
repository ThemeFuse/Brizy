import { defaultValueValue } from "visual/utils/onChange";

export function styleBorderWidth({ v, device, state, current }) {
  return defaultValueValue({ v, key: "borderWidthType", device, state }) ===
    "grouped"
    ? `${defaultValueValue({ v, key: "borderWidth", device, state })}px`
    : `${defaultValueValue({ v, key: current, device, state })}px`;
}
