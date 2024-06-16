import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Fonts } from "visual/types";
import {
  getDefaultFont,
  getFontById,
  getFontStyle,
  makeStyleCSSVar
} from "visual/utils/fonts";
import type { FontFamilyType } from "visual/utils/fonts/familyType";
import { FONT_INITIAL } from "visual/utils/fonts/utils";
import { DESKTOP } from "visual/utils/responsiveMode";
import { MValue } from "visual/utils/value";

interface Data {
  family: string;
  familyType: FontFamilyType;
  style?: string;
  fonts?: Fonts;
}

const familyCache = new Map();

export function getUsedModelFontFamily(): Array<{
  family: string;
  type: FontFamilyType;
}> {
  return [...familyCache].map(([family, type]) => ({ family, type }));
}

export function clearFamilyCache() {
  familyCache.clear();
}

// Stored all FontFamily to cache,
// then used for Export to know all fontFamily used in Models.
function storeFamilyToCache(data: Data) {
  const { style, family, familyType } = data;

  if (!style) {
    familyCache.set(family, familyType);
    return;
  }

  const fontStyle = getFontStyle(style);

  if (fontStyle) {
    const fontFamily = fontStyle["fontFamily"] || family;
    const fontFamilyType = fontStyle["fontFamilyType"] || familyType;
    familyCache.set(fontFamily, fontFamilyType);
  } else {
    const defaultFont = getDefaultFont();
    familyCache.set(defaultFont.font, defaultFont.group);
  }
}

export function getDetailsModelFontFamily(
  data: Data,
  config: ConfigCommon
): MValue<string> {
  const { family, familyType, style, fonts } = data;

  if (IS_PREVIEW) {
    storeFamilyToCache({ style, family, familyType });
  }

  if (style && style !== "custom") {
    return `var(${makeStyleCSSVar({
      id: style,
      device: DESKTOP,
      key: "fontFamily",
      config
    })}, ${FONT_INITIAL})`;
  }

  return getFontById({ type: familyType, family, fonts }).family;
}
