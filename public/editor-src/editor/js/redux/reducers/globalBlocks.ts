import _ from "underscore";
import produce, { setAutoFreeze } from "immer";
import { insert, removeAt } from "timm";

import {
  getBlockAlignment,
  changeRule,
  getAllowedGBIds,
  isPopup
} from "visual/utils/blocks";
import {
  globalBlocksAssembledSelector,
  globalBlocksPositionsSelector,
  globalBlocksInPageSelector,
  blocksOrderSelector,
  blocksOrderRawSelector
} from "visual/redux/selectors";

import { pageSelector } from "visual/redux/selectors2";

import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";

type GlobalBlocks = ReduxState["globalBlocks"];
type RGlobalBlocks = (
  s: GlobalBlocks,
  a: ReduxAction,
  f: ReduxState
) => GlobalBlocks;

setAutoFreeze(false);

export const globalBlocks: RGlobalBlocks = (state = {}, action, allState) => {
  // we had to get  pageId here and can't use it from config
  // because if it's cloud config if may be null
  const pageId = Number(pageSelector(allState).id);
  switch (action.type) {
    case "HYDRATE": {
      const {
        globalBlocks,
        page: {
          data: { items = [] }
        }
      } = action.payload;

      // it needs only for legacy models, when _id & globalBlock differed
      // only legacyBlocks have globalBlockId
      const legacyGlobalBlockIds = items
        .filter(block => block?.value?.globalBlockId)
        .map(block => block?.value?.globalBlockId);

      return Object.entries(globalBlocks).reduce((acc, [id, block]) => {
        if (legacyGlobalBlockIds.includes(id) && !isPopup(block.data)) {
          acc[id] = produce(block, draft => {
            draft.rules = changeRule(
              block,
              true,
              Number(action.payload.page.id)
            ).rules;
            draft.data.value._id = id;
          });
        } else {
          acc[id] = block;
        }
        return acc;
      }, {} as GlobalBlocks);
    }
    case "ADD_BLOCK": {
      return state;
    }
    case "ADD_GLOBAL_BLOCK": {
      const { _id } = action.payload.block.value;

      if (!isPopup(state[_id].data)) {
        return {
          ...state,
          [_id]: changeRule(state[_id], true, pageId)
        };
      }

      return state;
    }
    case "MAKE_POPUP_TO_GLOBAL_BLOCK":
    case "MAKE_NORMAL_TO_GLOBAL_BLOCK": {
      const { data, status, meta, rules, position } = action.payload;

      return produce(state, draft => {
        draft[data.value._id] = {
          meta,
          data,
          status,
          rules,
          position,
          dataVersion: 1
        };
      });
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      const { id, data } = action.payload;

      if (data.value === null && !isPopup(state[id].data)) {
        const globalBlock = changeRule(state[id], false, pageId);
        return {
          ...state,
          [id]: globalBlock
        };
      }

      return state;
    }

    case "REMOVE_BLOCK": {
      const { index } = action.payload;
      const blocks = blocksOrderSelector(allState);
      const globalBlockIds = Object.keys(state);
      const _id = blocks[index];

      if (globalBlockIds.includes(blocks[index]) && !isPopup(state[_id].data)) {
        const globalBlock = changeRule(state[_id], false, pageId);
        return {
          ...state,
          [_id]: globalBlock
        };
      }

      return state;
    }

    case "MAKE_GLOBAL_TO_NORMAL_BLOCK": {
      const { fromBlockId } = action.payload;

      const globalBlock = changeRule(state[fromBlockId], false, pageId);

      return {
        ...state,
        [fromBlockId]: globalBlock
      };
    }

    case "REORDER_BLOCKS": {
      const { oldIndex, newIndex } = action.payload;
      const pageBlocksIds: string[] = blocksOrderSelector(allState);
      const globalBlockIds: string[] = Object.keys(state);

      if (globalBlockIds.includes(pageBlocksIds[oldIndex])) {
        const movedBlock = pageBlocksIds[oldIndex];
        const newBlocksIds = insert(
          removeAt(pageBlocksIds, oldIndex),
          newIndex,
          movedBlock
        );

        const globalBlockId = pageBlocksIds[oldIndex];

        const oldPositionAlignment = getBlockAlignment(
          pageBlocksIds,
          oldIndex,
          globalBlockIds
        );
        const newPositionAlignment = getBlockAlignment(
          newBlocksIds,
          newIndex,
          globalBlockIds
        );

        if (
          oldPositionAlignment === "center" &&
          (newPositionAlignment === "top" || newPositionAlignment === "bottom")
        ) {
          const allowedGBIds: string[] = getAllowedGBIds(
            blocksOrderRawSelector(allState),
            state,
            pageId
          );

          if (!allowedGBIds.includes(globalBlockId)) {
            const globalBlock = changeRule(state[globalBlockId], true, pageId);

            return {
              ...state,
              [globalBlockId]: globalBlock
            };
          }
        }
      }

      return state;
    }

    case "REMOVE_BLOCKS": {
      const pageBlocksIds: string[] = blocksOrderSelector(allState);
      const pageBlocksIdsRaw: string[] = blocksOrderRawSelector(allState);
      const gbIds = _.difference(pageBlocksIds, pageBlocksIdsRaw);

      return produce(state, draft => {
        gbIds.forEach(id => {
          if (!isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, pageId);
          }
        });
      });
    }
    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;
      const prevIds = blocksOrderSelector(allState);
      const nextIds = blocks.map(block => block.value._id);

      const gbIds = _.difference(prevIds, nextIds);
      return produce(state, draft => {
        gbIds.forEach(id => {
          if (draft[id] && !isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, pageId);
          }
        });
      });
    }

    case "UPDATE_GB_RULES": {
      const { id, rules } = action.payload;

      return produce(state, draft => {
        draft[id].rules = rules;
        draft[id].dataVersion = draft[id].dataVersion + 1;
      });
    }
    case "DELETE_GLOBAL_BLOCK": {
      const { id } = action.payload;

      return produce(state, draft => {
        draft[id].data.deleted = true;
        draft[id].dataVersion = draft[id].dataVersion + 1;
      });
    }

    case "PUBLISH": {
      const allGlobalBlocks: GlobalBlocks = globalBlocksAssembledSelector(
        allState
      );

      const globalBlocksInPage = globalBlocksInPageSelector(allState);

      const positions = globalBlocksPositionsSelector(allState);

      return Object.entries(allGlobalBlocks).reduce((acc, [key, block]) => {
        acc[key] = produce(block, draft => {
          draft.position = positions[key] || null;
          draft.dataVersion = draft.dataVersion + 1;
          if (globalBlocksInPage[key]) {
            draft.status = "publish";
          }
        });

        return acc;
      }, {} as GlobalBlocks);
    }
    default:
      return state;
  }
};
