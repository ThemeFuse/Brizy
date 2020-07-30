import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";

type SyncAllowed = ReduxState["syncAllowed"];
type RSyncAllowed = (s: SyncAllowed, a: ReduxAction) => SyncAllowed;

export const syncAllowed: RSyncAllowed = (state, action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { syncAllowed } = action.payload;

      return syncAllowed;
    }
    case "UPDATE_SYNC_ALLOWED": {
      return action.payload;
    }
    default:
      return state;
  }
};
