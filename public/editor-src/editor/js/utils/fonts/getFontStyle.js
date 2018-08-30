import { getFontStyles } from "./getFontStyles";

export function getFontStyle(id) {
  return getFontStyles({ includeDeleted: true }).find(
    fontStyle => fontStyle.id === id
  );
}
