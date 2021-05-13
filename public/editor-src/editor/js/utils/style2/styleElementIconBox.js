import { defaultValueValue } from "visual/utils/onChange";

export function styleElementIconBoxIconPosition({ v }) {
  const { iconPosition } = v;

  return iconPosition === "right" ? "row-reverse" : "row";
}

export function styleElementIconBoxMarginLeft({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });
  const { iconPosition } = v;

  return iconPosition === "right" ? `${dvv("iconSpacing")}px` : "auto";
}

export function styleElementIconBoxMarginRight({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });
  const { iconPosition } = v;

  return iconPosition === "left" ? `${dvv("iconSpacing")}px` : "auto";
}
