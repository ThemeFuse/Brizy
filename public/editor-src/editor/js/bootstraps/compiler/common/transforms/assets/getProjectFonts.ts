import {
  AdobeFont,
  ExtraFontData,
  GoogleFont,
  UploadedFont
} from "visual/types";
import {
  makeSubsetGoogleFontsUrl,
  makeUploadFontsUrl
} from "visual/utils/fonts";
import { makeAdobeFontsUrl } from "visual/utils/fonts/makeAdobeFontsUrl";

type Fonts = {
  google: GoogleFont[];
  upload: UploadedFont[];
  adobe: AdobeFont[];
  extra?: ExtraFontData;
};

type FontLinks = {
  google?: string;
  upload?: string;
  adobe?: string;
};

const filteredByDeleted = (font: GoogleFont | UploadedFont): boolean => {
  return font.deleted !== true;
};

export const getFontLinks = ({ google, upload, extra }: Fonts): FontLinks => {
  const { adobeKitId } = extra ?? {};

  const gFonts = google.filter(filteredByDeleted);
  const uFonts = upload.filter(filteredByDeleted);
  const googleLinks = gFonts.length
    ? makeSubsetGoogleFontsUrl(gFonts)
    : undefined;
  const uploadLinks = uFonts.length ? makeUploadFontsUrl(uFonts) : undefined;
  const adobeData = adobeKitId ? { adobe: makeAdobeFontsUrl(adobeKitId) } : {};
  return {
    google: googleLinks,
    upload: uploadLinks,
    ...adobeData
  };
};
