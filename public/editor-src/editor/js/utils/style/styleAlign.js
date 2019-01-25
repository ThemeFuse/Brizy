import { defaultValueValue } from "visual/utils/onChange";

export function styleVerticalAlign({ v, device, state, hasItems }) {
  const aligns = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end"
  };

  return hasItems
    ? aligns[defaultValueValue({ v, key: "verticalAlign", device, state })]
    : "stretch";
}
