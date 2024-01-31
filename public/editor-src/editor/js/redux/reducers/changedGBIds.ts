import { ReduxAction } from "../actions2";
import { blocksOrderSelector, globalBlocksInPageSelector } from "../selectors";
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
    case "REMOVE_BLOCK": {
      const { index } = action.payload;

      const blocksIds = blocksOrderSelector(allState);
      const _id = blocksIds[index];

      return state.filter((id) => id !== _id);
    }
    case "REMOVE_BLOCKS": {
      const GBInPages = globalBlocksInPageSelector(allState);
      const GBIdsInPages = Object.keys(GBInPages);

      return state.filter((id) => !GBIdsInPages.includes(id));
    }
    case "UPDATE_GLOBAL_BLOCK": {
      const { id } = action.payload;

      return !state.includes(id) ? [...state, id] : state;
    }

    case "FETCH_PAGE_SUCCESS": {
      return [];
    }
    default: {
      return state;
    }
  }
};
