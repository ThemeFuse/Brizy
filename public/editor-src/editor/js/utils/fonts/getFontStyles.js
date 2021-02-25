import { getStore } from "visual/redux/store";
import {
  currentStyleSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";

export function getFontStyles({ includeDeleted = false } = {}) {
  const state = getStore().getState();
  const { fontStyles } = currentStyleSelector(state);
  const extraFontStyles = extraFontStylesSelector(state);
  const allFontStyles = [...fontStyles, ...extraFontStyles];

  return includeDeleted
    ? allFontStyles
    : allFontStyles.filter(el => el.deleted !== true);
}
