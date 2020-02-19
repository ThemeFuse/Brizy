import { getColorPaletteColors } from "visual/utils/color";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";

export default $ => {
  const richTextPaletteCSS = makeRichTextColorPaletteCSS(
    getColorPaletteColors()
  );

  $("head").append(`<style class="brz-style">${richTextPaletteCSS}</style>`);
};
