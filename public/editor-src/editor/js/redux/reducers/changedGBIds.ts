import { blocksOrderSelector, globalBlocksInPageSelector } from "../selectors";
import {
  REMOVE_BLOCK,
  REMOVE_BLOCKS,
  UPDATE_GLOBAL_BLOCK,
  MAKE_GLOBAL_TO_NORMAL_BLOCK,
  MAKE_NORMAL_TO_GLOBAL_BLOCK,
  MAKE_POPUP_TO_GLOBAL_BLOCK,
  MAKE_GLOBAL_BLOCK_TO_POPUP
} from "../actions";

import { ReduxState } from "../types";
import { FETCH_PAGE_SUCCESS, ADD_GLOBAL_BLOCK, ReduxAction } from "../actions2";

type ChangedGBIds = ReduxState["changedGBIds"];

type RChangedGBIds = (
  s: ChangedGBIds,
  a: ReduxAction,
  f: ReduxState
) => ChangedGBIds;

export const changedGBIds: RChangedGBIds = (state = [], action, allState) => {
  switch (action.type) {
    case ADD_GLOBAL_BLOCK: {
      const { _id } = action.payload.block.value;

      return [...state, _id];
    }
    case MAKE_POPUP_TO_GLOBAL_BLOCK:
    case MAKE_NORMAL_TO_GLOBAL_BLOCK: {
      const { _id } = action.payload.data.value;

      return [...state, _id];
    }
    case MAKE_GLOBAL_BLOCK_TO_POPUP:
    case MAKE_GLOBAL_TO_NORMAL_BLOCK: {
      const { fromBlockId } = action.payload;

      return !state.includes(fromBlockId) ? [...state, fromBlockId] : state;
    }
    case REMOVE_BLOCK: {
      const { index } = action.payload;

      const blocksIds = blocksOrderSelector(allState);
      const _id = blocksIds[index];

      return state.filter(id => id !== _id);
    }
    case REMOVE_BLOCKS: {
      const GBInPages = globalBlocksInPageSelector(allState);
      const GBIdsInPages = Object.keys(GBInPages);

      return state.filter(id => !GBIdsInPages.includes(id));
    }
    case UPDATE_GLOBAL_BLOCK: {
      const { id } = action.payload;

      return !state.includes(id) ? [...state, id] : state;
    }

    case FETCH_PAGE_SUCCESS: {
      return [];
    }
    default: {
      return state;
    }
  }
};
