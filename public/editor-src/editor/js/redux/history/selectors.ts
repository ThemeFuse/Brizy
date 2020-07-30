import { ReduxStateWithHistory } from "../types";

export const historySelector = (
  state: ReduxStateWithHistory
): ReduxStateWithHistory["history"] => state.history;
