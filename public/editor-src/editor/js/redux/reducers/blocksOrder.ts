import { insert, removeAt, replaceAt } from "timm";
import { generateBlocksList } from "visual/utils/blocks";
import { isStory } from "visual/utils/models";
import { DELETE_GLOBAL_BLOCK } from "../actions";
import { ActionTypes, ReduxAction } from "../actions2";
import { ReduxState } from "../types";

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
      const { page, globalBlocks, config } = action.payload;

      if (isStory(config) && items.length === 0) {
        return ["ecupxjcqmrpxjdimoebbkbnotrlufkfokjvr"];
      }

      // it needs only for legacy models, when _id & globalBlock differed
      // only legacyBlocks have globalBlockId
      const pageBlocksIds: string[] = items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.value.globalBlockId || item.value._id
      );

      return generateBlocksList({
        pageBlocksIds,
        page,
        globalBlocks,
        config
      });
    }

    case "ADD_GLOBAL_POPUP":
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

    case ActionTypes.REMOVE_BLOCK: {
      const { index } = action.payload;

      return removeAt(state, index);
    }

    case ActionTypes.REMOVE_BLOCKS: {
      return [];
    }

    case "MAKE_GLOBAL_POPUP_TO_POPUP": {
      const { block, fromBlockId, type } = action.payload;

      if (type == "external") {
        return replaceAt(
          state,
          state.findIndex((_id) => _id === fromBlockId),
          block.value._id
        );
      }

      return state;
    }

    case "MAKE_POPUP_TO_GLOBAL_POPUP": {
      const { block, fromBlockId, type } = action.payload;

      if (type === "external") {
        return replaceAt(
          state,
          state.findIndex((_id) => _id === fromBlockId),
          block.data.value._id
        );
      }

      return state;
    }

    case "MAKE_BLOCK_TO_GLOBAL_BLOCK": {
      const { block, fromBlockId } = action.payload;

      return replaceAt(
        state,
        state.findIndex((_id) => _id === fromBlockId),
        block.data.value._id
      );
    }

    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { block, fromBlockId } = action.payload;

      return replaceAt(
        state,
        state.findIndex((_id) => _id === fromBlockId),
        block.value._id
      );
    }

    case "REORDER_BLOCKS": {
      const { oldIndex, newIndex } = action.payload;
      const movedBlockId = state[oldIndex];

      return insert(removeAt(state, oldIndex), newIndex, movedBlockId);
    }
    case ActionTypes.IMPORT_TEMPLATE: {
      const { blocks: templateBlocks } = action.payload;
      const { insertIndex } = action.meta;

      const blocksIdsList = templateBlocks.map((item) => item.value._id);

      return insert(state, insertIndex, blocksIdsList);
    }

    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;

      return blocks.map((block) => block.value._id);
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      const { uid, data } = action.payload;

      if (data.value === null) {
        return state.filter((_id) => _id !== uid);
      }

      return state;
    }

    case DELETE_GLOBAL_BLOCK: {
      const { id } = action.payload;

      return state.filter((uid) => uid !== id);
    }

    default:
      return state;
  }
};
