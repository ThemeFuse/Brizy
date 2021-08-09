import { ReduxState } from "visual/redux/types";
import { Authorized, SyncAllowed } from "visual/types";

// === 0 DEPENDENCIES ===
export const pageSelector = (state: ReduxState): ReduxState["page"] =>
  state.page || {};

export const authorizedSelector = (state: ReduxState): Authorized =>
  state.authorized;

export const syncAllowedSelector = (state: ReduxState): SyncAllowed =>
  state.syncAllowed;

export const fontSelector = (state: ReduxState): ReduxState["fonts"] =>
  state.fonts || {};

export const extraFontStylesSelector = (
  state: ReduxState
): ReduxState["extraFontStyles"] => state.extraFontStyles;
