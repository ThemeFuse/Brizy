import { insert, removeAt, replaceAt } from "timm";
import { generateBlocksList } from "visual/utils/blocks";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";

import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";

type BlocksOrder = ReduxState["blocksOrder"];
type RBlocksOrder = (
  s: BlocksOrder,
  a: ReduxAction,
  f: ReduxState
) => BlocksOrder;

export const blocksOrder: RBlocksOrder = (state = [], action) => {
  switch (action.type) {
    case "HYDRATE": {
      const items = action.payload.page.data?.items || [];

      if (IS_STORY && items.length === 0) {
        return ["ecupxjcqmrpxjdimoebbkbnotrlufkfokjvr"];
      }

      // it needs only for legacy models, when _id & globalBlock differed
      // only legacyBlocks have globalBlockId
      const pageBlocksIds: string[] = items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.value.globalBlockId || item.value._id
      );

      return generateBlocksList(
        pageBlocksIds,
        action.payload.globalBlocks,
        action.payload.page
      );
    }
    case "ADD_GLOBAL_BLOCK":
    case "ADD_BLOCK": {
      const { block } = action.payload;
      const { insertIndex } = action.meta;

      const { _id } = block.value;

      // it can happen only for globalBlocks, which is inside pageJson,
      // but it was hidden by rules
      if (!state.includes(_id)) {
        return insert(state, insertIndex, block.value._id);
      }

      return state;
    }

    case "REMOVE_BLOCK": {
      const { index } = action.payload;

      return removeAt(state, index);
    }

    case "REMOVE_BLOCKS": {
      return [];
    }

    case "MAKE_GLOBAL_BLOCK_TO_POPUP": {
      if (IS_GLOBAL_POPUP) {
        const { block, fromBlockId } = action.payload;

        return replaceAt(
          state,
          state.findIndex(_id => _id === fromBlockId),
          block.value._id
        );
      }

      return state;
    }
    case "MAKE_GLOBAL_TO_NORMAL_BLOCK": {
      const { block, fromBlockId } = action.payload;

      return replaceAt(
        state,
        state.findIndex(_id => _id === fromBlockId),
        block.value._id
      );
    }

    case "REORDER_BLOCKS": {
      const { oldIndex, newIndex } = action.payload;
      const movedBlockId = state[oldIndex];

      return insert(removeAt(state, oldIndex), newIndex, movedBlockId);
    }
    case "IMPORT_TEMPLATE": {
      const { blocks: templateBlocks } = action.payload;
      const { insertIndex } = action.meta;

      const blocksIdsList = templateBlocks.map(item => item.value._id);

      return insert(state, insertIndex, blocksIdsList);
    }

    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;

      return blocks.map(block => block.value._id);
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { id, data } = action.payload as { id: string; data: any };

      if (data.value === null) {
        return state.filter(_id => _id !== id);
      }

      return state;
    }

    default:
      return state;
  }
};
