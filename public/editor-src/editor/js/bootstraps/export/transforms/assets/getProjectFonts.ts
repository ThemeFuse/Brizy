import {
  makeSubsetGoogleFontsUrl,
  makeUploadFontsUrl
} from "visual/utils/fonts";
import { GoogleFont, UploadedFont } from "visual/types";

type Fonts = {
  google: GoogleFont[];
  upload: UploadedFont[];
};

type FontLinks = {
  google?: string;
  upload?: string;
};

const filteredByDeleted = (font: GoogleFont | UploadedFont): boolean => {
  return font.deleted !== true;
};

export const getFontLinks = ({ google, upload }: Fonts): FontLinks => {
  const gFonts = google.filter(filteredByDeleted);
  const uFonts = upload.filter(filteredByDeleted);
  const googleLinks = gFonts.length
    ? makeSubsetGoogleFontsUrl(gFonts)
    : undefined;
  const uploadLinks = uFonts.length ? makeUploadFontsUrl(uFonts) : undefined;

  return {
    google: googleLinks,
    upload: uploadLinks
  };
};
