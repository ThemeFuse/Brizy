import { hexToRgb } from "visual/utils/color";

export const makeGlobalStylesColorPallete = (
  palettes: { id: string; hex: string }[]
): string => {
  const vars = palettes
    .map(({ id, hex }) => `--brz-global-${id}:${hexToRgb(hex)};`)
    .join("");
  return `:root{${vars}}`;
};
