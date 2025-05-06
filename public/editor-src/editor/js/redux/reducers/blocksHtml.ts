import { produce } from "immer";
import { BlockHtmlWithId, PublishedBlockHtml } from "visual/types/Block";
import { generateBlocksList } from "visual/utils/blocks";
import { getModelPopups } from "visual/utils/blocks/getModelPopups";
import { ActionTypes, ReduxAction } from "../actions2";
import {
  blocksOrderSelector,
  globalBlocksAssembledSelector
} from "../selectors";
import { ReduxState } from "../types";

type BlocksHtml = ReduxState["blocksHtml"];
type RBlocksHtml = (s: BlocksHtml, a: ReduxAction, f: ReduxState) => BlocksHtml;

const defaultState = {
  inProcessing: 0,
  inPending: false,
  blocks: {}
};

const getBlockHtml = (
  blocks: Array<BlockHtmlWithId>
): Record<string, PublishedBlockHtml> => {
  return blocks.reduce(
    (acc, block) => {
      acc[block.id] = {
        html: block.html
      } as PublishedBlockHtml;

      return acc;
    },
    {} as Record<string, PublishedBlockHtml>
  );
};

export const blocksHtml: RBlocksHtml = (
  state = defaultState,
  action,
  allState
) => {
  switch (action.type) {
    case "HYDRATE": {
      const { page, globalBlocks, config } = action.payload;
      const gbBlocks = Object.values(globalBlocks)
        .map((b) => b.blocks || [])
        .flat();

      const blocks = getBlockHtml([...(page.blocks || []), ...gbBlocks]);
      const items = page.data?.items || [];
      // it needs only for legacy models, when _id & globalBlock differed
      // only legacyBlocks have globalBlockId
      const pageBlocksIds: string[] = items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.value.globalBlockId || item.value._id
      );

      const blockOrders = generateBlocksList({
        pageBlocksIds,
        page,
        globalBlocks,
        config
      });

      let blocksHtml = blockOrders.reduce(
        (acc, blockId) => {
          const html = blocks[blockId];

          if (html) {
            acc[blockId] = html;
          }

          return acc;
        },
        {} as Record<string, PublishedBlockHtml>
      );

      const blockData = blockOrders.map((blockId) => {
        const data = globalBlocks[blockId];

        if (data) {
          return data;
        }

        return items.find((b) => b.value._id === blockId);
      });
      const popups = getModelPopups({ value: blockData });

      popups.forEach((popup) => {
        const blockId = popup.value._id;
        const html = blocks[blockId];

        if (html) {
          blocksHtml = { ...blocksHtml, [blockId]: html };
        }
      });

      return produce(state, (draft) => {
        draft.blocks = blocksHtml;
      });
    }
    case ActionTypes.REMOVE_BLOCKS: {
      return defaultState;
    }

    // @ts-expect-error: Currently not missing from ActionTypes
    case "UNDO": // @ts-expect-error: Currently not missing from ActionTypes
    case "REDO":
    case ActionTypes.IMPORT_TEMPLATE:
    case "UPDATE_BLOCKS":
    case "ADD_BLOCK":
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP":
    case "UPDATE_GLOBAL_BLOCK": {
      if (state.inPending) {
        return state;
      }

      return produce(state, (draft) => {
        draft.inPending = true;
      });
    }

    case ActionTypes.UPDATE_BLOCK_HTML: {
      const { blockId, data } = action.payload;
      return produce(state, (draft) => {
        draft.blocks[blockId] = data;
      });
    }

    case ActionTypes.UPDATE_BLOCKS_HTML: {
      const { blocks } = action.payload;
      return produce(state, (draft) => {
        blocks.forEach(({ id, block }) => {
          draft.blocks[id] = block;
        });
      });
    }

    case ActionTypes.REMOVE_BLOCK: {
      const { index } = action.payload;
      const globalBlocks = globalBlocksAssembledSelector(allState);
      const globalBlocksIds = Object.keys(globalBlocks);

      const blocksIds = blocksOrderSelector(allState);
      const id = blocksIds[index];

      if (!globalBlocksIds.includes(id)) {
        return produce(state, (draft) => {
          delete draft.blocks[id];
        });
      }

      return state;
    }

    case ActionTypes.UPDATE_BLOCK_HTML_STATS: {
      const { stats } = action.payload;
      return produce(state, (draft) => {
        draft.inProcessing = stats;

        if (stats === 0) {
          draft.inPending = false;
        }

        if (stats > 0 && !draft.inPending) {
          draft.inPending = true;
        }
      });
    }

    case "FETCH_PAGE_SUCCESS": {
      return produce(state, (draft) => {
        draft.blocks = Object.keys(draft.blocks).reduce(
          (acc, id) => {
            acc[id] = { html: "" };
            return acc;
          },
          {} as BlocksHtml["blocks"]
        );
      });
    }

    default:
      return state;
  }
};
