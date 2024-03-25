import {
  currentStyleSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { FontStyle } from "visual/types";

interface AllFontStyles {
  fontStyles?: ReduxState["currentStyle"]["fontStyles"];
  extraFontStyles?: ReduxState["extraFontStyles"];
}

export function getFontStyles(
  { includeDeleted = false } = {},
  _allFontStyles?: AllFontStyles
): Array<FontStyle> {
  let fontStyles = _allFontStyles?.fontStyles;
  let extraFontStyles = _allFontStyles?.extraFontStyles;

  if (fontStyles === undefined || extraFontStyles === undefined) {
    const state = getStore().getState();

    fontStyles = currentStyleSelector(state).fontStyles;
    extraFontStyles = extraFontStylesSelector(state);
  }

  const allFontStyles = [...(fontStyles ?? []), ...extraFontStyles];

  return includeDeleted
    ? allFontStyles
    : allFontStyles.filter((el) => el.deleted !== true);
}
