import { makeDefaultFontCSS } from "visual/utils/fonts";

export default function addDefaultFont($, font) {
  const defaultFontCSS = makeDefaultFontCSS(font);

  $("head").append(`<style>${defaultFontCSS}</style>`);
}
