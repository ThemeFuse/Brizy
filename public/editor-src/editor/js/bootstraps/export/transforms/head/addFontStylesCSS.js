import { getStore } from "visual/redux/store";
import { makeRichTextFontStylesCSS } from "visual/utils/fonts";

export default $head => {
  const { fontStyles } = getStore().getState().styles;
  const richTextFontStylesCSS = makeRichTextFontStylesCSS(fontStyles);

  $head.append(`<style>${richTextFontStylesCSS}</style>`);
};
