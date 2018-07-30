import { getStore } from "visual/redux/store";

export function getFontStyles() {
  const allFontStyles = getStore().getState().styles.fontStyles;

  return allFontStyles.filter(el => el.deleted !== true);
}
