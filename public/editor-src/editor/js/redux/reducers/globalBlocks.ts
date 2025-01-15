import { produce, setAutoFreeze } from "immer";
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
import { configSelector } from "visual/redux/selectors";
import {
  changeRule,
  getAllowedGBIds,
  getBlockAlignment,
  isPopup
} from "visual/utils/blocks";
import { getModelPopups } from "visual/utils/blocks/getModelPopups";
import { ActionTypes, ReduxAction } from "../actions2";
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
        },
        config: payloadConfig
      } = action.payload;

      // it needs only for legacy models, when _id & globalBlock differed
      // only legacyBlocks have globalBlockId
      const legacyGlobalBlockIds = items
        .filter((block) => block?.value?.globalBlockId)
        .map((block) => block?.value?.globalBlockId);

      return Object.entries(globalBlocks).reduce((acc, [id, block]) => {
        if (legacyGlobalBlockIds.includes(id) && !isPopup(block.data)) {
          acc[id] = produce(block, (draft) => {
            draft.rules = changeRule(
              block,
              true,
              action.payload.page,
              payloadConfig
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
      const config = configSelector(allState);

      return {
        ...state,
        [_id]: changeRule(state[_id], true, allState?.page, config)
      };
    }

    case "MAKE_POPUP_TO_GLOBAL_POPUP":
    case "MAKE_BLOCK_TO_GLOBAL_BLOCK": {
      const {
        uid,
        data,
        status,
        meta,
        rules,
        dataVersion,
        position,
        dependencies
      } = action.payload.block;

      return produce(state, (draft) => ({
        [data.value._id]: {
          uid,
          dataVersion,
          meta,
          data,
          status,
          rules,
          position,
          dependencies
        },
        ...draft
      }));
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      const { uid, data, title = "", tags = "" } = action.payload;

      if (data.value === null && !isPopup(state[uid].data)) {
        const config = configSelector(allState);
        const globalBlock = changeRule(
          state[uid],
          false,
          allState?.page,
          config
        );
        return {
          ...state,
          [uid]: globalBlock
        };
      }

      return produce(state, (draft) => {
        if (title.length > 0) {
          draft[uid].title = title;
        }
        draft[uid].tags = tags;
      });
    }

    case ActionTypes.REMOVE_BLOCK: {
      const { index } = action.payload;
      const blocks = blocksOrderSelector(allState);
      const globalBlockIds = Object.keys(state);
      const _id = blocks[index];

      if (globalBlockIds.includes(blocks[index]) && !isPopup(state[_id].data)) {
        const config = configSelector(allState);
        const globalBlock = changeRule(
          state[_id],
          false,
          allState?.page,
          config
        );
        return {
          ...state,
          [_id]: globalBlock
        };
      }

      return state;
    }

    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;
      const config = configSelector(allState);

      const globalBlock = changeRule(
        state[fromBlockId],
        false,
        allState?.page,
        config
      );

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
          const config = configSelector(allState);

          const allowedGBIds: string[] = getAllowedGBIds({
            pageBlocksIds: blocksOrderRawSelector(allState),
            globalBlocks: state,
            page: allState?.page,
            config
          });

          if (!allowedGBIds.includes(globalBlockId)) {
            const globalBlock = changeRule(
              state[globalBlockId],
              true,
              allState?.page,
              config
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

    case ActionTypes.REMOVE_BLOCKS: {
      const pageBlocksIds = blocksOrderSelector(allState);
      const config = configSelector(allState);
      const globalBlockIds = Object.keys(state);
      const gbIds = _.intersection(pageBlocksIds, globalBlockIds);

      return produce(state, (draft) => {
        gbIds.forEach((id) => {
          if (!isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, allState?.page, config);
          }
        });
      });
    }
    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;
      const prevIds = blocksOrderSelector(allState);
      const config = configSelector(allState);
      const nextIds = blocks.map((block) => block.value._id);

      const gbIds = _.difference(prevIds, nextIds);
      return produce(state, (draft) => {
        gbIds.forEach((id) => {
          if (draft[id] && !isPopup(draft[id].data)) {
            draft[id] = changeRule(draft[id], false, allState?.page, config);
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
      const allGlobalBlocks: GlobalBlocks =
        globalBlocksAssembledSelector(allState);

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
          const isPopup =
            block.data.type === "SectionPopup" ||
            block.data.type === "SectionPopup2";

          draft.dependencies = getModelPopups(draft.data)
            .filter((block) => block.type === "GlobalBlock")
            .map((b) => b.value._id);

          // The Popup doesn't have any positions on the page
          if (!isPopup) {
            draft.position = positions[key] || null;
          }

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
