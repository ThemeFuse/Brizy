import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  AdobeFont,
  ExtraFontData,
  GoogleFont,
  UploadedFont
} from "visual/types/Fonts";
import { makeAdobeFontsUrl } from "visual/utils/fonts/makeAdobeFontsUrl";
import {
  makeSubsetGoogleFontsUrl,
  makeUploadFontsUrl
} from "visual/utils/fonts/makeFontsUrl";

type Fonts = {
  google: GoogleFont[];
  upload: UploadedFont[];
  adobe: AdobeFont[];
  extra?: ExtraFontData;
  config: ConfigCommon;
};

type FontLinks = {
  google?: string;
  upload?: string;
  adobe?: string;
};

const filteredByDeleted = (font: GoogleFont | UploadedFont): boolean => {
  return font.deleted !== true;
};

export const getFontLinks = ({
  google,
  upload,
  extra,
  config
}: Fonts): FontLinks => {
  const { adobeKitId } = extra ?? {};
  const googleFontsUrl = config.urls?.googleFonts;

  const gFonts = google.filter(filteredByDeleted);
  const uFonts = upload.filter(filteredByDeleted);
  const googleLinks = gFonts.length
    ? makeSubsetGoogleFontsUrl(gFonts, googleFontsUrl)
    : undefined;
  const uploadLinks = uFonts.length
    ? makeUploadFontsUrl(uFonts, config)
    : undefined;
  const adobeData = adobeKitId ? { adobe: makeAdobeFontsUrl(adobeKitId) } : {};
  return {
    google: googleLinks,
    upload: uploadLinks,
    ...adobeData
  };
};
