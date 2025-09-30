import { produce } from "immer";
import { setIn } from "timm";
import { isStory } from "visual/providers/EditorModeProvider";
import { Block } from "visual/types/Block";
import { createGlobalBlockSymbol } from "visual/utils/blocks";
import { insertItemsBatch, isModel, mapModels } from "visual/utils/models";
import { map, objectTraverse2 } from "visual/utils/object";
import { DELETE_GLOBAL_BLOCK } from "../actions";
import { ActionTypes, ReduxAction } from "../actions2";
import { blocksOrderSelector, globalBlocksSelector } from "../selectors";
import { ReduxState } from "../types";

type BlocksData = ReduxState["blocksData"];
type RBlocksData = (s: BlocksData, a: ReduxAction, f: ReduxState) => BlocksData;

export const blocksData: RBlocksData = (state = {}, action, allState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { page, globalBlocks, editorMode } = action.payload;
      const items = page.data?.items || [];

      if (isStory(editorMode) && items.length === 0) {
        return {
          ecupxjcqmrpxjdimoebbkbnotrlufkfokjvr: {
            type: "Story",
            value: {
              _styles: ["story"],
              items: [
                {
                  type: "StoryItem",
                  value: {
                    _styles: ["story-item"],
                    items: [],
                    _id: "dfmwxzkwbiaezltvsxhdinhplvimzenkiqto"
                  }
                }
              ],
              _id: "ecupxjcqmrpxjdimoebbkbnotrlufkfokjvr"
            },
            blockId: "StoryDefault"
          }
        };
      }

      // it's needed for legacy popups
      const pageBlocksData = items.reduce((acc, block) => {
        const blockWithoutMeta = produce(block, (draft) => {
          delete draft.meta;
        });

        // globalBlockId - it's needed for legacy models
        const { _id, globalBlockId } = blockWithoutMeta.value;
        const id = globalBlockId || _id;
        acc[id] = blockWithoutMeta;

        return acc;
      }, {} as BlocksData);

      const globalBlocksData = Object.entries(globalBlocks).reduce(
        (acc, [id, item]) => {
          acc[id] = produce(item.data, (draft) => {
            draft.value._id = id;
          });

          return acc;
        },
        {} as BlocksData
      );

      return produce<BlocksData>(
        { ...pageBlocksData, ...globalBlocksData },
        (draft) => {
          objectTraverse2(draft, (obj: Block) => {
            if (obj.type && obj.type === "GlobalBlock") {
              const { globalBlockId } = obj.value;

              if (globalBlockId) {
                obj.value._id = globalBlockId;

                delete obj.value.globalBlockId;
              }
            }
          });
        }
      );
    }

    case ActionTypes.IMPORT_STORY: {
      const { blocks: storiesBlocks } = action.payload;
      const { insertIndex } = action.meta;
      const firstBlockId = blocksOrderSelector(allState)[0];

      const newPageBlocks = insertItemsBatch(
        state[firstBlockId].value.items,
        insertIndex,
        storiesBlocks
      );

      return setIn(
        state,
        [firstBlockId, "value", "items"],
        newPageBlocks
      ) as BlocksData;
    }

    case "ADD_BLOCK": {
      const { block } = action.payload;

      return {
        ...state,
        [block.value._id]: block
      };
    }

    case "MAKE_POPUP_TO_GLOBAL_POPUP": {
      const {
        block: { data },
        fromBlockId
      } = action.payload;

      const newState = mapModels((block: Block) => {
        if (block.value._id === fromBlockId) {
          return createGlobalBlockSymbol({
            blockId: block.blockId,
            uid: data.value._id
          });
        }
        return block;
      }, state);

      return produce<BlocksData>(newState, (draft) => {
        draft[data.value._id] = data;
      });
    }

    case "MAKE_GLOBAL_POPUP_TO_POPUP": {
      const { block: blockData, fromBlockId, type } = action.payload;

      if (type === "external") {
        return {
          ...state,
          [blockData.value._id]: blockData
        };
      }
      const parentId = action.payload.parentId;

      const childCb = (data: Block): Block => {
        if (data.value._id === fromBlockId) {
          return blockData;
        }

        return data;
      };

      const mapChild = (model: BlocksData): BlocksData => {
        return isModel(model)
          ? map(mapChild, childCb(model as unknown as Block))
          : map(mapChild, model);
      };

      const isParent = (data: BlocksData): boolean => {
        if (isModel(data)) {
          return (data as unknown as Block).value._id === parentId;
        }

        return false;
      };

      const mapParent = (model: BlocksData): BlocksData => {
        return isParent(model) ? mapChild(model) : map(mapParent, model);
      };

      return mapParent(state);
    }

    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { block } = action.payload;

      return {
        ...state,
        [block.value._id]: block
      };
    }

    case "MAKE_BLOCK_TO_GLOBAL_BLOCK": {
      const {
        block: { data },
        fromBlockId
      } = action.payload;

      return produce<BlocksData>(state, (draft) => {
        draft[data.value._id] = data;
        delete draft[fromBlockId];
      });
    }

    case DELETE_GLOBAL_BLOCK: {
      const { id } = action.payload;

      return produce<BlocksData>(state, (draft) => {
        delete draft[id];
      });
    }

    case ActionTypes.REMOVE_BLOCK: {
      const { index } = action.payload;
      const globalBlocks = globalBlocksSelector(allState);
      const globalBlocksIds = Object.keys(globalBlocks);

      const blocksIds = blocksOrderSelector(allState);
      const id = blocksIds[index];

      if (!globalBlocksIds.includes(id)) {
        return produce(state, (draft) => {
          delete draft[id];
        });
      }

      return state;
    }

    case ActionTypes.REMOVE_BLOCKS: {
      const blocksIds: string[] = blocksOrderSelector(allState);

      const globalBlocks = globalBlocksSelector(allState);
      const globalBlocksIds = Object.keys(globalBlocks);

      const pageBlocksIds = blocksIds.filter(
        (id) => !globalBlocksIds.includes(id)
      );

      return produce(state, (draft) => {
        pageBlocksIds.forEach((id) => {
          delete draft[id];
        });
      });
    }

    // if block is a slider & globalBlock and we remove
    // last slide - then instead of REMOVE_BLOCK action we get
    // UPDATE_GLOBAL_BLOCK - with payload.data.value = null
    case "UPDATE_GLOBAL_BLOCK": {
      const { uid, data } = action.payload;

      if (data.value === null) {
        return state;
      }

      return { ...state, [uid]: data };
    }

    case ActionTypes.IMPORT_TEMPLATE:
    case "UPDATE_BLOCKS": {
      const { blocks } = action.payload;

      const newBlocks = blocks.reduce((acc, item) => {
        if (item.type === "GlobalBlock") {
          return acc;
        }

        const id: string = item.value._id;
        acc[id] = item;

        return acc;
      }, {} as BlocksData);

      return {
        ...state,
        ...newBlocks
      };
    }

    default:
      return state;
  }
};
