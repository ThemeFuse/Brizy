import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";

export function styleBoxShadow({ v, device, state }) {
  return defaultValueValue({ v, key: "boxShadow", device, state }) === "on"
    ? `${defaultValueValue({
        v,
        key: "boxShadowHorizontal",
        device,
        state
      })}px ${defaultValueValue({
        v,
        key: "boxShadowVertical",
        device,
        state
      })}px ${defaultValueValue({ v, key: "boxShadowBlur", device, state })}px 
    
    ${defaultValueValue({
      v,
      key: "boxShadowSpread",
      device,
      state
    })}px ${hexToRgba(
        defaultValueValue({ v, key: "boxShadowColorHex", device, state }),
        defaultValueValue({ v, key: "boxShadowColorOpacity", device, state })
      )}`
    : "none";
}
