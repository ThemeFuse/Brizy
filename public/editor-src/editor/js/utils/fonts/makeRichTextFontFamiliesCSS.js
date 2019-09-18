import {
  getDefaultFont,
  getGoogleFontDetails,
  getUploadFontDetails
} from "visual/utils/fonts";

const makeCSS = ({ id, family }) =>
  `.brz .brz-ff-${id}{font-family:${family}!important;}`;

export const makeRichTextFontGoogleCSS = fonts => {
  return fonts
    .map(font => {
      const { id, family, deleted = false } = getGoogleFontDetails(font) || {};

      if (!id || !family) {
        console.warn(`There isn't family: ${JSON.stringify(font)}`);
        return "";
      }

      // If the font was deleted generate className with
      // old id and defaultFont Family
      if (deleted) {
        return makeCSS({
          id,
          family: getGoogleFontDetails(getDefaultFont().font).family
        });
      }

      return makeCSS({ id, family });
    })
    .join("");
};

export const makeRichTextFontUploadCSS = fonts => {
  return fonts
    .map(font => {
      const { id, family, deleted = false } = getUploadFontDetails(font) || {};

      if (!id || !family) {
        console.warn(`There isn't family: ${JSON.stringify(font)}`);
        return "";
      }

      // If the font was deleted generate className with
      // old id and defaultFont Family
      if (deleted) {
        return makeCSS({
          id,
          family: getGoogleFontDetails(getDefaultFont().font).family
        });
      }

      return makeCSS({ id, family });
    })
    .join("");
};
