import { styleTypographyElementCountdownLabelFontSize } from "visual/utils/style2";

export function cssStyleTypographyElementCountdownLabelFontSize({ v, device }) {
  return `font-size:${styleTypographyElementCountdownLabelFontSize({
    v,
    device
  })};`;
}
