import { defaultValueValue } from "visual/utils/onChange";

export function styleBorderStyle({ v, device, state }) {
  return defaultValueValue({ v, key: "borderStyle", device, state }) === ""
    ? "none"
    : defaultValueValue({ v, key: "borderStyle", device, state });
}
