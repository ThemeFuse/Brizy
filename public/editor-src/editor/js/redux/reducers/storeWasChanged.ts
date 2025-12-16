import { ActionTypes, ReduxAction } from "../actions2";
import { ReduxState, StoreChanged } from "../types";

type StoreWasChanged = ReduxState["storeWasChanged"];
type RStoreWasChanged = (s: StoreWasChanged, a: ReduxAction) => StoreWasChanged;

export const storeWasChanged: RStoreWasChanged = (state, action) => {
  switch (action.type) {
    case "HYDRATE": {
      return StoreChanged.unchanged;
    }

    case "FETCH_PAGE_SUCCESS": {
      if (state === StoreChanged.pending) {
        return StoreChanged.unchanged;
      }

      return state;
    }

    case "ADD_BLOCK":
    case ActionTypes.REMOVE_BLOCK:
    case ActionTypes.REMOVE_BLOCKS:
    case "REORDER_BLOCKS":
    case "UPDATE_BLOCKS":
    case "UPDATE_GLOBAL_BLOCK":
    case ActionTypes.UPDATE_GLOBAL_BLOCK_METADATA:
    case "MAKE_BLOCK_TO_GLOBAL_BLOCK":
    case "MAKE_POPUP_TO_GLOBAL_POPUP":
    case "MAKE_GLOBAL_POPUP_TO_POPUP":
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK":
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP":
    case ActionTypes.UPDATE_CURRENT_STYLE_ID:
    case ActionTypes.UPDATE_CURRENT_STYLE:
    case ActionTypes.REGENERATE_TYPOGRAPHY:
    case ActionTypes.REGENERATE_COLORS:
    case "UPDATE_EXTRA_FONT_STYLES":
    case ActionTypes.IMPORT_TEMPLATE:
    case ActionTypes.IMPORT_STORY:
    case "UNDO":
    case "REDO":
    case ActionTypes.CREATE_SYMBOL:
    case ActionTypes.UPDATE_SYMBOL:
    case ActionTypes.DELETE_SYMBOL: {
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
    case ActionTypes.UPDATE_ERROR: {
      return StoreChanged.unchanged;
    }
    default:
      return state;
  }
};
