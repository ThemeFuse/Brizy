import { FontStyleTypes, is } from "visual/utils/fonts/stylesType";

export const blockTagFromStyle = (fontStyle: FontStyleTypes): string => {
  switch (fontStyle) {
    case "paragraph":
    case "button":
      return "p";
    case "heading1":
      return "h1";
    case "heading2":
    case "subtitle":
    case "abovetitle":
      return "h2";
    case "heading3":
      return "h3";
    case "heading4":
      return "h4";
    case "heading5":
      return "h5";
    case "heading6":
      return "h6";
  }
};

export const getTagNameFromFontStyle = (
  fontStyle: string
): {
  tagName?: string;
} => {
  return is(fontStyle)
    ? {
        tagName: blockTagFromStyle(fontStyle)
      }
    : {};
};
