import { ReduxState } from "../types";

export const historySelector = (state: ReduxState): ReduxState["history"] =>
  state.history;
