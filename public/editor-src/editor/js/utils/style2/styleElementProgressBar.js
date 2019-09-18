import { defaultValueValue } from "visual/utils/onChange";

export function styleElementProgressBarPercentage({ v, device, state }) {
  return defaultValueValue({ v, key: "percentage", device, state });
}
