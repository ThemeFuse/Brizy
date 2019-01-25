import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";

export function styleBorderColor({ v, device, state }) {
  return hexToRgba(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorOpacity", device, state })
  );
}
