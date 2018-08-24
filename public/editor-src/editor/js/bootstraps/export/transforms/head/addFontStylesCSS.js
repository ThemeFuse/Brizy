import { getFontStyles, makeRichTextFontStylesCSS } from "visual/utils/fonts";

export default function addFontStylesCSS($head, $body) {
  const allPossibleFontStyles = getFontStyles({ includeDeleted: true });
  const parsedFontStyles = parseBodyFontStyles($body);
  const parsedFontStylesObj = arrayToObject(parsedFontStyles);

  const fontStylesToLoad = allPossibleFontStyles.filter(
    fs => parsedFontStylesObj[fs.id]
  );
  const richTextFontStylesCSS = makeRichTextFontStylesCSS(fontStylesToLoad);

  $head.append(`<style>${richTextFontStylesCSS}</style>`);
}

function parseBodyFontStyles($body) {
  const fontStyles = new Set();

  $body(`[class*="brz-tp-"]`).each(function() {
    const className = $body(this).attr("class");
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
