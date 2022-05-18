import { defaultValueValue } from "visual/utils/onChange";

export function styleElementIconBoxIconPosition({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });
  const position = dvv("iconPosition");

  return position === "right"
    ? "row-reverse"
    : position === "top"
    ? "column"
    : "row";
}
