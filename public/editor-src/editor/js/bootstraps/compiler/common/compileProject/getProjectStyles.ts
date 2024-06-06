import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
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
import { isExternalPopup } from "visual/utils/models";
import { MValue } from "visual/utils/value";
import { projectClassName } from "../utils/projectClassName";

function parseDynamicFontStyles(config: ConfigCommon): string[] {
  const fontStyles = new Set<string>();

  if (config.dynamicContent?.groups?.richText) {
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

export const getProjectStyles = (config: ConfigCommon): string => {
  let getClassName = (c: string): string => c;
  const globalClassName = projectClassName(config);

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (isExternalPopup(config) && globalClassName) {
    getClassName = (className: string): string =>
      `.${globalClassName} ${className}`;
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

export const getTypographyStyles = (config: ConfigCommon): MValue<string> => {
  const allPossibleFontStyles = getFontStyles({ includeDeleted: true });
  const parsedDynamicFontStyles = parseDynamicFontStyles(config);
  const parsedDynamicFontStylesObj = arrayToObject(parsedDynamicFontStyles);

  const dynamicFontStylesToLoad = allPossibleFontStyles.filter(
    (fs) => parsedDynamicFontStylesObj[fs.id]
  );

  if (dynamicFontStylesToLoad.length === 0) {
    return undefined;
  }

  return makeRichTextDynamicFontStylesCSS(dynamicFontStylesToLoad);
};
