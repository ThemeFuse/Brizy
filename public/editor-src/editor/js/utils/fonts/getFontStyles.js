import { getStore } from "visual/redux/store";
import { currentStyleSelector } from "visual/redux/selectors";
import { extraFontStylesSelector } from "visual/redux/selectors2";

export function getFontStyles({ includeDeleted = false } = {}) {
  const state = getStore().getState();
  const { fontStyles } = currentStyleSelector(state);
  const extraFontStyles = extraFontStylesSelector(state);
  const allFontStyles = [...fontStyles, ...extraFontStyles];

  return includeDeleted
    ? allFontStyles
    : allFontStyles.filter(el => el.deleted !== true);
}
