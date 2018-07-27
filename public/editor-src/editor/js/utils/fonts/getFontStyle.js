import { getFontStyles } from "./getFontStyles";

export function getFontStyle(id) {
  return getFontStyles().find(fontStyle => fontStyle.id === id);
}
