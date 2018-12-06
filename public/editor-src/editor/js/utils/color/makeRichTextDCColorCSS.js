import { getColorPaletteColor } from "visual/utils/color";

export const makeRichTextDCColorCSS = (
  className,
  { hex, opacity, colorPalette }
) => {
  const color = colorPalette ? getColorPaletteColor(colorPalette).hex : hex;
  const rules = [];
  if (color) {
    rules.push(`color: ${color}`);
  }
  if (opacity) {
    rules.push(`opacity: ${opacity}`);
  }

  return `${className} { ${rules.join(";")} }`;
};
