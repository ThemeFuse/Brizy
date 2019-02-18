import { defaultValueValue } from "visual/utils/onChange";

export function styleAlignVerticalAlign({ v, device, hasItems = true }) {
  const aligns = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end"
  };

  return hasItems
    ? aligns[defaultValueValue({ v, key: "verticalAlign", device })]
    : "stretch";
}

export function styleAlignHorizontalAlign({ v, device }) {
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  return aligns[defaultValueValue({ v, key: "horizontalAlign", device })];
}
