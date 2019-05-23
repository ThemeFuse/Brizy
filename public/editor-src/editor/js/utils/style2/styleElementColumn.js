import { defaultValueValue } from "visual/utils/onChange";

export function styleElementColumnMinHeight({ v, device }) {
  return defaultValueValue({ v, key: "columnsHeightStyle", device }) ===
    "custom"
    ? `${defaultValueValue({ v, key: "columnsHeight", device })}px`
    : "auto";
}
