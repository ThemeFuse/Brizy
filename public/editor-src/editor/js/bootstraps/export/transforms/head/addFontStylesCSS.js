import { getFontStyles, makeRichTextFontStylesCSS } from "visual/utils/fonts";

export default function addFontStylesCSS($) {
  const allPossibleFontStyles = getFontStyles({ includeDeleted: true });
  const parsedFontStyles = parseFontStyles($);
  const parsedFontStylesObj = arrayToObject(parsedFontStyles);

  const fontStylesToLoad = allPossibleFontStyles.filter(
    fs => parsedFontStylesObj[fs.id]
  );
  const richTextFontStylesCSS = makeRichTextFontStylesCSS(fontStylesToLoad);

  $("head").append(`<style>${richTextFontStylesCSS}</style>`);
}

function parseFontStyles($) {
  const fontStyles = new Set();

  $(`[class*="brz-tp-"]`).each(function() {
    const className = $(this).attr("class");
    const match = className.match(/brz-tp-([^\s]+)/);

    fontStyles.add(match[1]);
  });

  return [...fontStyles];
}

function arrayToObject(arr, valueFill = true) {
  return arr.reduce((acc, item) => {
    acc[item] = valueFill;
    return acc;
  }, {});
}
