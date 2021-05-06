export const makeRichTextColorPaletteCSS = (
  palettes: { id: string; hex: string }[],
  prefix?: (s: string) => string
): string => {
  return palettes
    .map(({ id, hex }) => {
      let inlineClassName = `.brz-cp-${id.toLowerCase()}`;
      let blockClassName = `.brz-bcp-${id.toLowerCase()}`;

      if (typeof prefix === "function") {
        inlineClassName = prefix(inlineClassName);
        blockClassName = prefix(blockClassName);
      }

      return `.brz ${inlineClassName}, .brz ${blockClassName}{color: ${hex};}`;
    })
    .join("");
};
