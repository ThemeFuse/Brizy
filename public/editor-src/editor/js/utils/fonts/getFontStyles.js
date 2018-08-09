import { getStore } from "visual/redux/store";
import { currentStyleSelector } from "visual/redux/selectors";

export function getFontStyles({ includeDeleted = false } = {}) {
  const allFontStyles = currentStyleSelector(getStore().getState())
    .mergedFontStyles;

  return includeDeleted
    ? allFontStyles
    : allFontStyles.filter(el => el.deleted !== true);
}
