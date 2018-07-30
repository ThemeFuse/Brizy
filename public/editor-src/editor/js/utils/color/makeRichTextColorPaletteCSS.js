export const makeRichTextColorPaletteCSS = colorPalette => {
  return colorPalette
    .map(({ id, hex }) => `.brz .brz-cp-${id.toLowerCase()}{color: ${hex};}`)
    .join("");
};
