export const makeRichTextColorPaletteCSS = (
  colorPalette,
  { getClassName = c => c } = {}
) => {
  return colorPalette
    .map(({ id, hex }) => {
      const className = getClassName(`.brz-cp-${id.toLowerCase()}`);

      return `.brz ${className}, .brz ${className}{color: ${hex};}`;
    })
    .join("");
};
