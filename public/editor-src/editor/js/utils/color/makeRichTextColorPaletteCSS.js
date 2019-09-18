export const makeRichTextColorPaletteCSS = colorPalette => {
  return colorPalette
    .map(
      ({ id, hex }) =>
        `.brz .brz-cp-${id.toLowerCase()}, .brz .brz-bcp-${id.toLowerCase()}{color: ${hex};}`
    )
    .join("");
};
