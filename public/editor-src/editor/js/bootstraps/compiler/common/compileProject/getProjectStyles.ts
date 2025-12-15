import { uniqBy } from "es-toolkit/array";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { currentStyleSelector, fontsSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import {
  AdobeFont,
  FontFamilyType,
  GoogleFont,
  UploadedFont
} from "visual/types/Fonts";
import {
  makeGlobalStylesColorPalette,
  makeRichTextColorPaletteCSS
} from "visual/utils/color";
import { getFontStyles } from "visual/utils/fonts/getFontStyles";
import { makeGlobalStylesTypography } from "visual/utils/fonts/makeGlobalStylesTypography";
import {
  dynamicStyleIds,
  makeRichTextDynamicFontStylesCSS
} from "visual/utils/fonts/makeRichTextFontStylesCSS";
import { tripId } from "visual/utils/fonts/transform";
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

export const getProjectStyles = (
  config: ConfigCommon,
  store: Store
): string => {
  let getClassName = (c: string): string => c;
  const globalClassName = projectClassName(config);

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (isExternalPopup(config) && globalClassName) {
    getClassName = (className: string): string =>
      `.${globalClassName} ${className}`;
  }
  const globalPalette = currentStyleSelector(store.getState()).colorPalette;

  const typographyStyles = makeGlobalStylesTypography({
    fontStyles: getFontStyles({ store }),
    store,
    config
  });

  const richTextColorPalette = makeRichTextColorPaletteCSS(
    globalPalette,
    config,
    getClassName
  );

  const globalStyleColorPalette = makeGlobalStylesColorPalette(
    globalPalette,
    config
  );

  return `${richTextColorPalette}${globalStyleColorPalette}${typographyStyles}`;
};

export const getTypographyStyles = (
  config: ConfigCommon,
  store: Store
): MValue<string> => {
  const allPossibleFontStyles = getFontStyles({
    includeDeleted: true,
    store
  });
  const parsedDynamicFontStyles = parseDynamicFontStyles(config);
  const parsedDynamicFontStylesObj = arrayToObject(parsedDynamicFontStyles);

  const dynamicFontStylesToLoad = allPossibleFontStyles.filter(
    (fs) => parsedDynamicFontStylesObj[fs.id]
  );

  if (dynamicFontStylesToLoad.length === 0) {
    return undefined;
  }

  return makeRichTextDynamicFontStylesCSS(dynamicFontStylesToLoad, store);
};

export const getUsedProjectFonts = (
  store: Store
): {
  googleFonts: GoogleFont[];
  uploadedFonts: UploadedFont[];
  adobeFonts: AdobeFont[];
} => {
  const fontStyles = getFontStyles({ store });
  const uniqueFontStyles = uniqBy(fontStyles, (fs) => fs.fontFamily);
  const fonts = fontsSelector(store.getState());
  const googleFontSources = [
    fonts.google?.data ?? [],
    fonts.config?.data ?? [],
    fonts.blocks?.data ?? []
  ];
  const googleFontByFamily = new Map<string, GoogleFont>();
  const uploadedFontByFamily = new Map<string, UploadedFont>();
  const adobeFontByFamily = new Map<string, AdobeFont>();

  googleFontSources.forEach((collection) => {
    collection.forEach((font) => {
      if (!font.deleted && !googleFontByFamily.has(font.family)) {
        googleFontByFamily.set(tripId(font.family), font);
      }
    });
  });

  (fonts.upload?.data ?? []).forEach((font) => {
    if (!font.deleted && !uploadedFontByFamily.has(font.family)) {
      uploadedFontByFamily.set(font.id, font);
    }
  });

  (fonts.adobe?.data ?? []).forEach((font) => {
    if (!adobeFontByFamily.has(font.family)) {
      adobeFontByFamily.set(tripId(font.family), font);
    }
  });

  const usedFonts = {
    googleFonts: [] as GoogleFont[],
    uploadedFonts: [] as UploadedFont[],
    adobeFonts: [] as AdobeFont[]
  };
  const usedGoogleFamilies = new Set<string>();
  const usedUploadFamilies = new Set<string>();
  const usedAdobeFamilies = new Set<string>();

  uniqueFontStyles.forEach((fontStyle) => {
    if (fontStyle.fontFamilyType === FontFamilyType.google) {
      const font = googleFontByFamily.get(fontStyle.fontFamily);

      if (font && !usedGoogleFamilies.has(font.family)) {
        usedGoogleFamilies.add(font.family);
        usedFonts.googleFonts.push(font);
      }
    }

    if (fontStyle.fontFamilyType === FontFamilyType.upload) {
      const font = uploadedFontByFamily.get(fontStyle.fontFamily);

      if (font && !usedUploadFamilies.has(font.family)) {
        usedUploadFamilies.add(font.family);
        usedFonts.uploadedFonts.push(font);
      }
    }

    if (fontStyle.fontFamilyType === FontFamilyType.adobe) {
      const font = adobeFontByFamily.get(fontStyle.fontFamily);

      if (font && !usedAdobeFamilies.has(font.family)) {
        usedAdobeFamilies.add(font.family);
        usedFonts.adobeFonts.push(font);
      }
    }
  });

  return usedFonts;
};
