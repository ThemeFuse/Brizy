import _ from "underscore";
import googleFonts from "visual/config/googleFonts";

const googleFontsByIds = _.indexBy(googleFonts, "id");

export default function getFontById(fontId) {
  return googleFontsByIds[fontId] || null;
}
