import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function styleAlignFlexVerticalAlign({ v, device, state, prefix = "" }) {
  const aligns = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    between: "space-between"
  };
  const dvv = key => defaultValueValue({ v, key, device, state });

  const type = dvv(capByPrefix(prefix, "verticalAlign"));

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

export function styleAlignHorizontal({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "horizontalAlign"));
}
