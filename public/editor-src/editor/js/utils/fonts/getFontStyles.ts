import {
  currentStyleSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { FontStyle } from "visual/types";

interface AllFontStyles {
  fontStyles?: ReduxState["currentStyle"]["fontStyles"];
  extraFontStyles?: ReduxState["extraFontStyles"];
}

interface Data {
  store: Store;
  includeDeleted?: boolean;
}

export function getFontStyles(
  data: Data,
  _allFontStyles?: AllFontStyles
): Array<FontStyle> {
  const { includeDeleted = false, store } = data;
  let fontStyles = _allFontStyles?.fontStyles;
  let extraFontStyles = _allFontStyles?.extraFontStyles;

  if (fontStyles === undefined || extraFontStyles === undefined) {
    const state = store.getState();

    fontStyles = currentStyleSelector(state).fontStyles;
    extraFontStyles = extraFontStylesSelector(state);
  }

  const allFontStyles = [...(fontStyles ?? []), ...extraFontStyles];

  return includeDeleted
    ? allFontStyles
    : allFontStyles.filter((el) => el.deleted !== true);
}
