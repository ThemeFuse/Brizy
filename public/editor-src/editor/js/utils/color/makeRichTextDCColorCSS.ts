import { getColor } from "visual/utils/color";
import { MValue } from "visual/utils/value";

interface Color {
  hex?: string;
  opacity?: number;
  colorPalette?: string;
}

export const makeRichTextDCColorCSS = (
  className: string,
  { hex, opacity, colorPalette }: Color
): MValue<string> => {
  const color = getColor(colorPalette ?? "", hex ?? "", opacity ?? 1);

  if (color) {
    return `${className} { color: ${color} }`;
  }

  return undefined;
};
