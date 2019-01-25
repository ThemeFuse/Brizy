import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";

export function styleBgColor({ v, device, state }) {
  return hexToRgba(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorOpacity", device, state })
  );
}
