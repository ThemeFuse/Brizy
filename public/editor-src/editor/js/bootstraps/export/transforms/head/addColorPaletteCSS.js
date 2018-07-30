import { getStore } from "visual/redux/store";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";

export default $head => {
  const { colorPalette } = getStore().getState().styles;
  const richTextPaletteCSS = makeRichTextColorPaletteCSS(colorPalette);

  $head.append(`<style>${richTextPaletteCSS}</style>`);
};
