import produce, { setAutoFreeze } from "immer";
import { insert, removeAt } from "timm";
import _ from "underscore";
import {
  blocksOrderRawSelector,
  blocksOrderSelector,
  changedGBIdsSelector,
  globalBlocksAssembledSelector,
  globalBlocksInPageSelector,
  globalBlocksPositionsSelector
} from "visual/redux/selectors";
import {
  changeRule,
  getAllowedGBIds,
  getBlockAlignment,
  isPopup
} from "visual/utils/blocks";
import { ReduxAction } from "../actions2";
import { ReduxState } from "../types";

type GlobalBlocks = ReduxState["globalBlocks"];
type RGlobalBlocks = (
  s: GlobalBlocks,
  a: ReduxAction,
  f: ReduxState
) => GlobalBlocks;

setAutoFreeze(false);

export const globalBlocks: RGlobalBlocks = (state = {}, action, allState) => {
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
        .filter((block) => block?.value?.globalBlockId)
        .map((block) => block?.value?.globalBlockId);

      return Object.entries(globalBlocks).reduce((acc, [id, block]) => {
        if (legacyGlobalBlockIds.includes(id) && !isPopup(block.data)) {
          acc[id] = produce(block, (draft) => {
            draft.rules = changeRule(block, true, action.payload.page).rules;
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
          [_id]: changeRule(state[_id], true, allState?.page)
        };
      }

      return state;
    }
    case "MAKE_POPUP_TO_GLOBAL_BLOCK":
    case "MAKE_NORMAL_TO_GLOBAL_BLOCK": {
      const { data, status, meta, rules, position } = action.payload;

      return produce(state, (draft) => {
        draft[data.value._id] = {
          meta,
          data,
          status,
          rules,
          position
        };
      });
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      const { id, data } = action.payload;

      if (data.value === null && !isPopup(state[id].data)) {
        const globalBlock = changeRule(state[id], false, allState?.page);
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
        const globalBlock = changeRule(state[_id], false, allState?.page);
        return {
          ...state,
          [_id]: globalBlock
        };
      }

      return state;
    }

    case "MAKE_GLOBAL_TO_NORMAL_BLOCK": {
      const { fromBlockId } = action.payload;

      const globalBlock = changeRule(state[fromBlockId], false, allState?.page);

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
            allState?.page
          );

          if (!allowedGBIds.includes(globalBlockId)) {
            const globalBlock = changeRule(
              state[globalBlockId],
              true,
              allState?.page
            );

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

      return produce(state, (draft) => {
        gbIds.forEach((id) => {
          if (!isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, allState?.page);
          }
        });
      });
    }
    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;
      const prevIds = blocksOrderSelector(allState);
      const nextIds = blocks.map((block) => block.value._id);

      const gbIds = _.difference(prevIds, nextIds);
      return produce(state, (draft) => {
        gbIds.forEach((id) => {
          if (draft[id] && !isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, allState?.page);
          }
        });
      });
    }

    case "UPDATE_GB_RULES": {
      const { id, rules } = action.payload;

      return produce(state, (draft) => {
        draft[id].rules = rules;
      });
    }
    case "DELETE_GLOBAL_BLOCK": {
      const { id } = action.payload;

      return produce(state, (draft) => {
        draft[id].data.deleted = true;
      });
    }

    case "PUBLISH": {
      const allGlobalBlocks: GlobalBlocks = globalBlocksAssembledSelector(
        allState
      );

      const globalBlocksInPage = globalBlocksInPageSelector(allState);

      const changedGlobalBlocksIds = changedGBIdsSelector(allState);
      const changedGBData = changedGlobalBlocksIds.reduce(
        (acc: GlobalBlocks, gbId: string) => {
          return { ...acc, [gbId]: allGlobalBlocks[gbId] };
        },
        {}
      );

      const positions = globalBlocksPositionsSelector(allState);

      return Object.entries(allGlobalBlocks).reduce((acc, [key, block]) => {
        acc[key] = produce(block, (draft) => {
          draft.position = positions[key] || null;

          const isPopup =
            block.data.type === "SectionPopup" ||
            block.data.type === "SectionPopup2";

          if (globalBlocksInPage[key] || changedGBData[key] || isPopup) {
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
