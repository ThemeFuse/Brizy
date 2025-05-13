import { ActionTypes, ReduxAction } from "../actions2";
import { globalBlocksInPageSelector, globalBlocksSelector } from "../selectors";
import { ReduxState } from "../types";

type ChangedGBIds = ReduxState["changedGBIds"];

type RChangedGBIds = (
  s: ChangedGBIds,
  a: ReduxAction,
  f: ReduxState
) => ChangedGBIds;

export const changedGBIds: RChangedGBIds = (state = [], action, allState) => {
  switch (action.type) {
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      return [...state, action.payload.block.value._id];
    }
    case "MAKE_POPUP_TO_GLOBAL_POPUP":
    case "MAKE_BLOCK_TO_GLOBAL_BLOCK": {
      return [...state, action.payload.block.data.value._id];
    }
    case "MAKE_GLOBAL_POPUP_TO_POPUP":
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;

      return !state.includes(fromBlockId) ? [...state, fromBlockId] : state;
    }
    case ActionTypes.REMOVE_BLOCK: {
      const { id } = action.payload;
      const globalBlocks = globalBlocksSelector(allState);

      // Need to add the global block ID to state because every
      // global block, when deleted, changes the rule
      // to exclude the global block for the current page.
      if (globalBlocks[id] && !state.includes(id)) {
        return [...state, id];
      }

      return state;
    }
    case ActionTypes.REMOVE_BLOCKS: {
      const GBInPages = globalBlocksInPageSelector(
        allState,
        action.payload.config
      );

      const GBIdsInPages = Object.keys(GBInPages);
      const newState = state;

      // Need to add the global block ID to state because every
      // global block, when deleted, changes the rule
      // to exclude the global block for the current page.
      for (let i = 0; i < GBIdsInPages.length; i++) {
        const id = GBIdsInPages[i];

        if (!state.includes(id)) {
          newState.push(id);
        }
      }

      return newState;
    }
    case "UPDATE_GLOBAL_BLOCK": {
      const { uid } = action.payload;

      return !state.includes(uid) ? [...state, uid] : state;
    }

    case "FETCH_PAGE_SUCCESS": {
      return [];
    }
    default: {
      return state;
    }
  }
};
