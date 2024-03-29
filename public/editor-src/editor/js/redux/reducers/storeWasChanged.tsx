import { ActionTypes, ReduxAction } from "../actions2";
import { ReduxState, StoreChanged } from "../types";

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
    case "UPDATE_GLOBAL_BLOCK":
    case "MAKE_BLOCK_TO_GLOBAL_BLOCK":
    case "MAKE_POPUP_TO_GLOBAL_POPUP":
    case "MAKE_GLOBAL_POPUP_TO_POPUP":
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK":
    case ActionTypes.UPDATE_CURRENT_STYLE_ID: // @ts-expect-error: don't have in ts
    case ActionTypes.UPDATE_CURRENT_STYLE:
    case "UPDATE_EXTRA_FONT_STYLES":
    case ActionTypes.IMPORT_TEMPLATE: // @ts-expect-error: don't have in ts
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
