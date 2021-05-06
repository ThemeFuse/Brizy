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

function generateGoogleAssets(fonts: GoogleFont[]): string {
  const fontsUrl = makeSubsetGoogleFontsUrl(fonts);

  return `<link class="brz-link brz-link-google" type="text/css" rel="stylesheet" href="${fontsUrl}" />`;
}

function generateUploadAssets(fonts: UploadedFont[]): string {
  const fontsUrl = makeUploadFontsUrl(fonts);

  return `<link class="brz-link brz-link-upload" type="text/css" rel="stylesheet" href="${fontsUrl}" />`;
}

export const getFontLinks = ({ google, upload }: Fonts): FontLinks => {
  const gFonts = google.filter(filteredByDeleted);
  const uFonts = upload.filter(filteredByDeleted);
  const googleLinks = gFonts.length ? generateGoogleAssets(google) : undefined;
  const uploadLinks = uFonts.length ? generateUploadAssets(upload) : undefined;

  return {
    google: googleLinks,
    upload: uploadLinks
  };
};
