import { ReduxState, StoreChanged } from "../types";
import { ReduxAction } from "../actions2";

type StoreWasChanged = ReduxState["storeWasChanged"];
type RStoreWasChanged = (s: StoreWasChanged, a: ReduxAction) => StoreWasChanged;

export const storeWasChanged: RStoreWasChanged = (state, action) => {
  switch (action.type) {
    case "HYDRATE": {
      return StoreChanged.unchanged;
    }
    case "ADD_BLOCK":
    case "REMOVE_BLOCK":
    case "REMOVE_BLOCKS":
    case "REORDER_BLOCKS":
    case "UPDATE_BLOCKS":
    case "UPDATE_GLOBAL_BLOCK": // @ts-expect-error: don't have in ts
    case "UPDATE_CURRENT_STYLE_ID": // @ts-expect-error: don't have in ts
    case "UPDATE_CURRENT_STYLE":
    case "UPDATE_EXTRA_FONT_STYLES":
    case "IMPORT_TEMPLATE": // @ts-expect-error: don't have in ts
    case "UNDO": // @ts-expect-error: don't have in ts
    case "REDO": {
      return StoreChanged.changed;
    }
    case "PUBLISH": {
      return StoreChanged.pending;
    }
    case "STORE_WAS_CHANGED": {
      return action.payload;
    }
    // right now we have functionality for only refresh the page if some request was fail
    // need implement other functionality for "try again" and this code must we reviewed again
    // @ts-expect-error: don't have in ts
    case "UPDATE_ERROR": {
      return StoreChanged.unchanged;
    }
    default:
      return state;
  }
};
