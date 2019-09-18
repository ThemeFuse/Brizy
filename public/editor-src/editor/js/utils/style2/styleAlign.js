import { defaultValueValue } from "visual/utils/onChange";

export function styleAlignFlexVerticalAlign({ v, device, state }) {
  const aligns = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end"
  };

  const type = defaultValueValue({ v, key: "verticalAlign", device, state });

  return type === undefined ? type : aligns[type];
}

export function styleAlignFlexHorizontalAlign({ v, device, state }) {
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const horizontalAlign = defaultValueValue({
    v,
    key: "horizontalAlign",
    device,
    state
  });

  return horizontalAlign === undefined
    ? horizontalAlign
    : aligns[horizontalAlign];
}

export function styleAlignHorizontalAlign({ v, device, state }) {
  return defaultValueValue({ v, key: "horizontalAlign", device, state });
}
