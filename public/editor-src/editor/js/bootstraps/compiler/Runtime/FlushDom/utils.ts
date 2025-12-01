import { produce } from "immer";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { updateBlocksHtml } from "visual/redux/actions2";
import {
  fontsSelector,
  globalPopupsInPageSelector,
  pageSelector,
  projectSelector,
  stylesSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Block } from "visual/types/Block";
import { createDebounceById } from "visual/utils/debounce/createDebounceById";
import { Queue } from "visual/utils/queue/Queue";
import { compilePage } from "../../browser/worker";

function compile(blocksData: Array<Block>, store: Store, config: ConfigCommon) {
  // Return a function that will be called on QueueWorker
  return async () => {
    const state = store.getState();
    const dispatch = store.dispatch;
    const fonts = fontsSelector(state);
    const styles = stylesSelector(state);
    // Include only global popups because:
    // When a global popup is included in the blocks,
    // it needs to render a placeholder.
    const globalPopups = globalPopupsInPageSelector(state, config);
    const project = produce(projectSelector(state), (draft) => {
      draft.data.fonts = fonts;
      draft.data.styles = styles;
    });
    const page = produce(pageSelector(state), (draft) => {
      draft.data.items = blocksData;
    });

    const compileData = {
      config: {
        ...config,
        globalBlocks: globalPopups
      },
      page,
      project
    };

    const { blocks } = await compilePage(compileData);

    dispatch(updateBlocksHtml({ blocks }));
  };
}

export function addQueue(
  queue: Queue<unknown>,
  blocks: Array<Block>,
  store: Store,
  config: ConfigCommon
): void {
  const blockId = blocks.map((b) => b.value._id).join("");
  queue.add(blockId, compile(blocks, store, config));
}

export const addQueueDebounced = createDebounceById(addQueue, 800);
