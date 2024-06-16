import { FontKeyTypes } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { GoogleFont, SystemFont, UploadedFont } from "visual/types";
import { findFonts, projectFontsData } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { FontGroup } from "visual/utils/fonts/getFontById";

interface UsedFonts {
  google: Array<GoogleFont>;
  upload: Array<UploadedFont>;
  system: Array<SystemFont>;
}

type RFonts = ReduxState["fonts"];

interface Data {
  fonts: RFonts;
  parsedFonts: Array<{ type: FontFamilyType; family: string }>;
  defaultFont: FontGroup<FontKeyTypes>;
  projectDefaultFontId: string;
}

export const getUsedFonts = (data: Data): UsedFonts => {
  const { fonts, parsedFonts, defaultFont, projectDefaultFontId } = data;
  const fontMap: UsedFonts = {
    google: [],
    upload: [],
    system: []
  };

  // @ts-expect-error: Property 'upload' | 'google' does not exist on type '{}'.
  const { upload = [], google = [], system = [] } = projectFontsData(fonts);
  let includedDefaultProjectFont = false;

  parsedFonts.forEach(({ type, family }) => {
    if (!includedDefaultProjectFont) {
      includedDefaultProjectFont = projectDefaultFontId === family;
    }

    switch (type) {
      case "system": {
        const font = findFonts(system, family);
        if (font) {
          fontMap.system.push(font);
        }
        break;
      }
      case "upload": {
        const font = findFonts(upload, family, "upload");
        font && fontMap.upload.push(font);
        break;
      }
      case "google": {
        const font = findFonts(google, family);
        font && fontMap.google.push(font);
        break;
      }
    }
  });

  // Added Default project font
  if (!includedDefaultProjectFont) {
    const { group, font } = defaultFont;

    switch (group) {
      case "upload":
        fontMap.upload.push(font as UploadedFont);
        break;
      case "system":
        fontMap.system.push(font as SystemFont);
        break;
      default:
        fontMap.google.push(font as GoogleFont);
    }
  }
  return fontMap;
};
