import { defaultValueValue } from "visual/utils/onChange";
import { styleElementIconBoxIconPosition } from "visual/utils/style2";

export function cssStyleElementIconBoxFlexDirection({ v }) {
  return `flex-direction:${styleElementIconBoxIconPosition({ v })};`;
}

export function cssStyleElementIconBoxMargin({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });
  const spacing = dvv("iconSpacing");
  const position = dvv("iconPosition");

  return position === "right"
    ? `margin-left:${spacing}px; margin-right: auto;`
    : position === "top"
    ? `margin-bottom:${spacing}px; margin-right: auto; margin-left: auto;`
    : `margin-left:auto; margin-right: ${spacing}px;`;
}
