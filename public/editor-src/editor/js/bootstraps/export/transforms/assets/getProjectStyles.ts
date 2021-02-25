import * as cheerio from "cheerio";
import {
  getColorPaletteColors,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import {
  getFontStyles,
  dynamicStyleIds,
  makeRichTextFontStylesCSS,
  makeRichTextDynamicFontStylesCSS
} from "visual/utils/fonts";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";

function parseFontStyles($: cheerio.CheerioAPI): string[] {
  const fontStyles = new Set<string>();

  $("[class*='brz-tp-']").each(function(this: cheerio.Element) {
    const classNames = $(this)
      .attr("class")
      ?.split(" ");

    classNames?.forEach(className => {
      const fontStyle = className
        .replace("brz-tp-xs-", "")
        .replace("brz-tp-sm-", "")
        .replace("brz-tp-lg-", "")
        .replace("brz-tp-", "");

      fontStyles.add(fontStyle);
    });
  });

  return [...fontStyles];
}

function parseDynamicFontStyles($: cheerio.CheerioAPI): string[] {
  const fontStyles = new Set<string>();

  if ($("[class*='brz-tp__dc-block']").length) {
    Object.keys(dynamicStyleIds).forEach(key => {
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

export const getProjectStyles = (): string => {
  let getClassName = (c: string): string => c;

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (IS_EXTERNAL_POPUP) {
    const popupId = $(".brz-popup2").attr("id");

    getClassName = (className: string): string => `#${popupId} ${className}`;
  }

  const richTextPaletteCSS = makeRichTextColorPaletteCSS(
    getColorPaletteColors(),
    getClassName
  );

  return `<style class="brz-style brz-project__style-palette">${richTextPaletteCSS}</style>`;
};

export const getTypographyStyles = ($: cheerio.CheerioAPI): string => {
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

  let getClassName = (c: string): string => c;

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (IS_EXTERNAL_POPUP) {
    const popupId = $(".brz-popup2").attr("id");

    getClassName = (className: string): string => `#${popupId} ${className}`;
  }

  const richTextFontStylesCSS = makeRichTextFontStylesCSS(
    fontStylesToLoad,
    getClassName
  );

  const richTextDynamicFontStylesCSS = makeRichTextDynamicFontStylesCSS(
    dynamicFontStylesToLoad
  );

  return `<style class="brz-style brz-project__style-fonts">${richTextFontStylesCSS}${richTextDynamicFontStylesCSS}</style>`;
};
