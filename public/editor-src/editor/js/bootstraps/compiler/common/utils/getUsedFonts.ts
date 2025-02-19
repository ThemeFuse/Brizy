import { FontKeyTypes } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import {
  AdobeFont,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import { FontFamilyType } from "visual/types/Fonts";
import { FontGroup } from "visual/utils/fonts/getFontById";
import { findFonts, projectFontsData } from "visual/utils/fonts/transform";
import { ProjectFontsData } from "../types";

interface UsedFonts {
  fonts: {
    google: Array<GoogleFont>;
    upload: Array<UploadedFont>;
    system: Array<SystemFont>;
    adobe: Array<AdobeFont>;
  };
  adobeKitId?: string;
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
    fonts: {
      google: [],
      upload: [],
      adobe: [],
      system: []
    }
  };

  // @ts-expect-error: Property 'upload' | 'google' does not exist on type '{}'.
  const {
    upload = [],
    google = [],
    system = [],
    adobe = []
  }: ProjectFontsData = projectFontsData(fonts);

  let includedDefaultProjectFont = false;

  const { fonts: _font } = fontMap;
  const adobeKitId = fonts?.adobe?.id;

  parsedFonts.forEach(({ type, family }) => {
    if (!includedDefaultProjectFont) {
      includedDefaultProjectFont = projectDefaultFontId === family;
    }

    switch (type) {
      case "adobe": {
        const font = findFonts(adobe, family);
        if (font && adobeKitId) {
          _font.adobe.push(font);
        }
        break;
      }
      case "system": {
        const font = findFonts(system, family);
        if (font) {
          _font.system.push(font);
        }
        break;
      }
      case "upload": {
        const font = findFonts(upload, family, "upload");
        font && _font.upload.push(font);
        break;
      }
      case "google": {
        const font = findFonts(google, family);
        font && _font.google.push(font);
        break;
      }
    }
  });

  // Added Default project font
  if (!includedDefaultProjectFont) {
    const { group, font } = defaultFont;

    switch (group) {
      case "upload":
        _font.upload.push(font as UploadedFont);
        break;
      case "system":
        _font.system.push(font as SystemFont);
        break;
      case "adobe":
        _font.adobe.push(font as AdobeFont);
        break;
      default:
        _font.google.push(font as GoogleFont);
    }
  }
  return { fonts: _font, adobeKitId };
};
