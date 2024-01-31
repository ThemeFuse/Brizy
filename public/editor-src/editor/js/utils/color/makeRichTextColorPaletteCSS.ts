import Config from "visual/global/Config";
import { makeStylePaletteCSSVar } from "./makeGlobalStylesColorPallete";

export const makeRichTextColorPaletteCSS = (
  palettes: { id: string; hex: string }[],
  prefix?: (s: string) => string
): string => {
  const config = Config.getAll();

  return palettes
    .map(({ id }) => {
      let inlineClassName = `.brz-cp-${id.toLowerCase()}`;
      let blockClassName = `.brz-bcp-${id.toLowerCase()}`;
      let bgInlineClassName = `.brz-bgp-${id.toLowerCase()}`;

      if (typeof prefix === "function") {
        inlineClassName = prefix(inlineClassName);
        blockClassName = prefix(blockClassName);
        bgInlineClassName = prefix(bgInlineClassName);
      }

      const color = `rgb(var(${makeStylePaletteCSSVar(id, config)}))`;
      const background = `rgb(var(${makeStylePaletteCSSVar(id, config)}))`;

      return `.brz ${inlineClassName}, .brz ${blockClassName}{color: ${color};} .brz ${bgInlineClassName}{background-color: ${background};}`;
    })
    .join("");
};
