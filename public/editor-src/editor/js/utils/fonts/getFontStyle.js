import { getFontStyles } from "./getFontStyles";

export function getFontStyle(id, allFontStyles) {
  return getFontStyles({ includeDeleted: true }, allFontStyles).find(
    (fontStyle) => fontStyle.id === id
  );
}
