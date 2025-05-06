import { defaultValueValue } from "visual/utils/onChange";
import { styleElementIconBoxIconPosition } from "visual/utils/style2";

export function cssStyleElementIconBoxFlexDirection({ v }) {
  return `flex-direction:${styleElementIconBoxIconPosition({ v })};`;
}

export function cssStyleElementIconBoxMargin({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });
  const spacing = dvv("iconSpacing");
  const position = dvv("iconPosition");

  switch (position) {
    case "right":
      return `margin-inline-start:${spacing}px; margin-inline-end: auto;`;
    case "top":
      return `margin-bottom:${spacing}px; margin-inline-end: auto; margin-inline-start: auto;`;
    default:
      return `margin-inline-start:auto; margin-inline-end: ${spacing}px;`;
  }
}
