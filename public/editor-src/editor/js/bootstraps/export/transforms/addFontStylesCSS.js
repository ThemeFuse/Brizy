import {
  getFontStyles,
  dynamicStyleIds,
  makeRichTextFontStylesCSS,
  makeRichTextDynamicFontStylesCSS
} from "visual/utils/fonts";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";

export default function addFontStylesCSS($) {
  const allPossibleFontStyles = getFontStyles({ includeDeleted: true });
  const parsedFontStyles = parseFontStyles($);
  const parsedDynamicFontStyles = parseDynamicFontStyles($);
  const parsedFontStylesObj = arrayToObject(parsedFontStyles);
  const parsedDynamicFontStylesObj = arrayToObject(parsedDynamicFontStyles);

  const fontStylesToLoad = allPossibleFontStyles.filter(
    fs => parsedFontStylesObj[fs.id]
  );
  const dynamicFontStylesToLoad = allPossibleFontStyles.filter(
    fs => parsedDynamicFontStylesObj[fs.id]
  );

  let getClassName = c => c;

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (IS_EXTERNAL_POPUP) {
    const popupId = $(".brz-popup2").attr("id");

    getClassName = className => `#${popupId} ${className}`;
  }

  const richTextFontStylesCSS = makeRichTextFontStylesCSS(fontStylesToLoad, {
    getClassName
  });

  const richTextDynamicFontStylesCSS = makeRichTextDynamicFontStylesCSS(
    dynamicFontStylesToLoad
  );

  $("head").append(
    `<style class="brz-style">${richTextFontStylesCSS}${richTextDynamicFontStylesCSS}</style>`
  );
}

function parseFontStyles($) {
  const fontStyles = new Set();

  $("[class*='brz-tp-']").each(function() {
    const className = $(this).attr("class");
    const match = className.match(/brz-tp-([^\s]+)/);

    fontStyles.add(match[1]);
  });

  return [...fontStyles];
}

function parseDynamicFontStyles($) {
  const fontStyles = new Set();

  if ($("[class*='brz-tp__dc-block']").length) {
    Object.keys(dynamicStyleIds).forEach(key => {
      fontStyles.add(key);
    });
  }

  return [...fontStyles];
}

function arrayToObject(arr, valueFill = true) {
  return arr.reduce((acc, item) => {
    acc[item] = valueFill;
    return acc;
  }, {});
}
