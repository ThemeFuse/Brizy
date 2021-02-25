export const makeRichTextColorPaletteCSS = (
  palettes: { id: string; hex: string }[],
  prefix?: (s: string) => string
): string => {
  return palettes
    .map(({ id, hex }) => {
      let className = `.brz-cp-${id.toLowerCase()}`;

      if (typeof prefix === "function") {
        className = prefix(className);
      }

      return `.brz ${className}, .brz ${className}{color: ${hex};}`;
    })
    .join("");
};
