import getFontById from "./getFontById";

export const makeRichTextFontFamiliesCSS = fonts => {
  return fonts
    .map(id => {
      const { family } = getFontById(id) || {};

      if (!family) {
        console.warn(`There isn't family: ${id}`);
        return "";
      }

      return `.brz .brz-ff-${id}{font-family:${family}!important;}`;
    })
    .join("");
};
