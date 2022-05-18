import { ReduxState, StoreChanged } from "visual/redux/types";
import { Authorized, Font, SyncAllowed } from "visual/types";
import { createSelector } from "reselect";
import { getGroupFontsById } from "visual/utils/fonts";
import { NonEmptyArray } from "visual/utils/array/types";
import { FontKeyTypes } from "visual/redux/actions2";
import { isShopifyPage } from "visual/global/Config/types/configs/Cloud";

// === 0 DEPENDENCIES ===
export const projectSelector = (state: ReduxState): ReduxState["project"] =>
  state.project;

export const pageSelector = (state: ReduxState): ReduxState["page"] =>
  state.page;

export const authorizedSelector = (state: ReduxState): Authorized =>
  state.authorized;

export const syncAllowedSelector = (state: ReduxState): SyncAllowed =>
  state.syncAllowed;

export const fontsSelector = (state: ReduxState): ReduxState["fonts"] =>
  state.fonts;

export const extraFontStylesSelector = (
  state: ReduxState
): ReduxState["extraFontStyles"] => state.extraFontStyles;

export const uiSelector = (state: ReduxState): ReduxState["ui"] => state.ui;

export const storeWasChangedSelector = (
  state: ReduxState
): ReduxState["storeWasChanged"] =>
  state.storeWasChanged || StoreChanged.unchanged;

// === END 0 DEPENDENCIES ===

// === 1 DEPENDENCY ===

const deletedPredicate = <T extends { deleted?: boolean }>(t: T): boolean =>
  t.deleted !== true;

export const unDeletedFontsSelector = createSelector(
  fontsSelector,
  (fonts): ReduxState["fonts"] => {
    return Object.entries(fonts).reduce((acc, curr) => {
      const [type, { data = [] } = { data: [] }] = curr;

      return {
        ...acc,
        [`${type}`]: {
          data: data.filter(deletedPredicate)
        }
      };
    }, {});
  }
);

export const defaultFontSelector = createSelector(
  projectSelector,
  project => project.data.font
);

export const getDefaultFontDetailsSelector = createSelector(
  defaultFontSelector,
  fontsSelector,
  (defaultFont, fonts) => {
    const groups = getGroupFontsById(fonts, defaultFont);

    if (groups) {
      return groups;
    }

    const [[group, { data = [] }]] = Object.entries(fonts) as NonEmptyArray<
      [FontKeyTypes, { data: Font[] }]
    >;

    return { group, font: data[0] };
  }
);

export const currentRoleSelector = createSelector(
  uiSelector,
  ui => ui.currentRole
);

export const currentLanguageSelector = createSelector(
  uiSelector,
  ui => ui.currentLanguage
);

export const leftSidebarSelector = createSelector(
  uiSelector,
  ui => ui.leftSidebar
);

export const pageLayout = createSelector(pageSelector, page => {
  if (isShopifyPage(page)) {
    return page.layout;
  }

  return undefined;
});
