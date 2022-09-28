import {
  getColorPaletteColors,
  makeGlobalStylesColorPalette,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import {
  dynamicStyleIds,
  getFontStyles,
  makeGlobalStylesTypography,
  makeRichTextDynamicFontStylesCSS
} from "visual/utils/fonts";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";
import { MValue } from "visual/utils/value";

function parseDynamicFontStyles($: cheerio.Root): string[] {
  const fontStyles = new Set<string>();

  if ($("[class*='brz-tp__dc-block']").length) {
    Object.keys(dynamicStyleIds).forEach((key) => {
      fontStyles.add(key);
    });
  }

  return [...fontStyles];
}

type ArrayToObject = { [k: string]: boolean };

function arrayToObject<T extends string>(
  arr: T[],
  valueFill = true
): ArrayToObject {
  return arr.reduce((acc, item) => {
    acc[item] = valueFill;
    return acc;
  }, {} as ArrayToObject);
}

export const getProjectStyles = ($: cheerio.Root): string => {
  let getClassName = (c: string): string => c;

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (IS_EXTERNAL_POPUP) {
    const popupId = $(".brz-popup2").attr("id");

    getClassName = (className: string): string => `#${popupId} ${className}`;
  }

  const typographyStyles = makeGlobalStylesTypography(getFontStyles());

  const richTextColorPalette = makeRichTextColorPaletteCSS(
    getColorPaletteColors(),
    getClassName
  );

  const globalStyleColorPalette = makeGlobalStylesColorPalette(
    getColorPaletteColors()
  );

  return `${richTextColorPalette}${globalStyleColorPalette}${typographyStyles}`;
};

export const getTypographyStyles = ($: cheerio.Root): MValue<string> => {
  const allPossibleFontStyles = getFontStyles({ includeDeleted: true });
  const parsedDynamicFontStyles = parseDynamicFontStyles($);
  const parsedDynamicFontStylesObj = arrayToObject(parsedDynamicFontStyles);

  const dynamicFontStylesToLoad = allPossibleFontStyles.filter(
    (fs) => parsedDynamicFontStylesObj[fs.id]
  );

  if (dynamicFontStylesToLoad.length === 0) {
    return undefined;
  }

  return makeRichTextDynamicFontStylesCSS(dynamicFontStylesToLoad);
};
