import { ReduxState, StoreChanged } from "visual/redux/types";
import { Authorized, SyncAllowed } from "visual/types";
import { createSelector } from "reselect";

// === 0 DEPENDENCIES ===
export const projectSelector = (state: ReduxState): ReduxState["project"] =>
  state.project;

export const pageSelector = (state: ReduxState): ReduxState["page"] =>
  state.page;

export const authorizedSelector = (state: ReduxState): Authorized =>
  state.authorized;

export const syncAllowedSelector = (state: ReduxState): SyncAllowed =>
  state.syncAllowed;

export const fontSelector = (state: ReduxState): ReduxState["fonts"] =>
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

export const unDeletedFontSelector = createSelector(
  fontSelector,
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

export const currentRoleSelector = createSelector(
  uiSelector,
  ui => ui.currentRole
);

export const leftSidebarSelector = createSelector(
  uiSelector,
  ui => ui.leftSidebar
);
