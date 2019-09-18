import { defaultValueValue } from "visual/utils/onChange";

export function styleElementColumnMinHeightType({ v, device }) {
  return defaultValueValue({ v, key: "columnsHeightStyle", device });
}

export function styleElementColumnMinHeight({ v, device }) {
  return defaultValueValue({ v, key: "columnsHeight", device });
}
