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

      if (typeof prefix === "function") {
        inlineClassName = prefix(inlineClassName);
        blockClassName = prefix(blockClassName);
      }

      const color = `rgb(var(${makeStylePaletteCSSVar(id, config)}))`;

      return `.brz ${inlineClassName}, .brz ${blockClassName}{color: ${color};}`;
    })
    .join("");
};
