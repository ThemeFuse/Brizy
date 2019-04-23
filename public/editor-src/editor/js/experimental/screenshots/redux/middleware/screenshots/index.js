import _ from "underscore";
import {
  EDITOR_RENDERED,
  UPDATE_UI,
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK
} from "visual/redux/actions";
import { ActionTypes as HistoryActionTypes } from "visual/redux/reducers/historyEnhancer";
import {
  updatePage,
  updateGlobalBlock,
  updateSavedBlock
} from "visual/redux/actions";
import {
  pageDataSelector as getPageData,
  pageBlocksSelector as getPageBlocks,
  savedBlocksSelector as getSavedBlocks,
  globalBlocksSelector as getGlobalBlocks,
  deviceModeSelector
} from "visual/redux/selectors";
import {
  makeBlockScreenshot,
  uploadBlockScreenshot,
  updateBlockWithScreenshotInfo,
  makeTaskQueue,
  debounceAdvanced
} from "./utils";
// import { makeBlockScreenshot } from "./utils/makeBlockScreenshotDomToImage";
// import { makeBlockScreenshot } from "./utils/makeBlockScreenshotMainThread";

const { UNDO, REDO } = HistoryActionTypes;

const TASK_QUEUE_INTERVAL = 2000;
const DEBOUNCE_INTERVAL = 2000;

const taskQueue = makeTaskQueue({
  interval: TASK_QUEUE_INTERVAL
});
const getBlocksMap = blocks =>
  blocks.reduce((acc, block) => {
    acc[block.value._id] = block;
    return acc;
  }, {});
const blockIsInThePage = (blockId, store) =>
  Boolean(getBlocksMap(getPageBlocks(store.getState()))[blockId]);
const blockIsInSaved = (blockId, store) =>
  Boolean(getSavedBlocks(store.getState())[blockId]);
const isDesktopMode = store =>
  deviceModeSelector(store.getState()) === "desktop";

export default store => next => action => {
  const prevState = store.getState();
  next(action);

  if (action.type === UPDATE_UI && action.key === "deviceMode") {
    if (action.value === "desktop") {
      taskQueue.start();
    } else {
      taskQueue.stop();
    }
  }

  if (
    action.type === EDITOR_RENDERED ||
    (action.type === UPDATE_GLOBALS && action.key === "styles")
  ) {
    allBlocksDebounced(store, next);
  }

  if (!isDesktopMode(store)) {
    return;
  }

  if (
    action.type === UPDATE_PAGE ||
    action.type === UPDATE_GLOBAL_BLOCK ||
    action.type === UNDO ||
    action.type === REDO
  ) {
    changedBlocksDebounced(prevState, store, next);
  }

  if (
    action.type === CREATE_SAVED_BLOCK ||
    action.type === CREATE_GLOBAL_BLOCK
  ) {
    const options = {
      ...(action.type === CREATE_GLOBAL_BLOCK
        ? { globalIsAutosave: false }
        : {})
    };
    changedBlocks(prevState, store, next, options);
  }
};

function allBlocks(store, next) {
  const changedBlocks = {
    page: new Set(),
    saved: new Set(),
    global: new Set()
  };

  const currState = store.getState();

  // collect page blocks
  {
    const currBlocks = getPageBlocks(currState);
    currBlocks.forEach(block => {
      if (block.type === "SectionPopup") {
        return;
      }

      if (block.type === "GlobalBlock") {
        changedBlocks.global.add(block.value.globalBlockId);
      } else {
        changedBlocks.page.add(block);
      }
    });
  }

  enqueueTasks(changedBlocks, store, next);
}

const allBlocksDebounced = _.debounce(allBlocks, DEBOUNCE_INTERVAL);

function changedBlocks(prevState, store, next, options) {
  const changedBlocks = {
    page: new Set(),
    saved: new Set(),
    global: new Set()
  };

  const currState = store.getState();

  // collect changed page blocks
  {
    const prevBlocksMap = getBlocksMap(getPageBlocks(prevState));
    const currBlocksMap = getBlocksMap(getPageBlocks(currState));
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      if (block !== prevBlocksMap[blockId]) {
        if (block.type === "GlobalBlock") {
          changedBlocks.global.add(block.value.globalBlockId);
        } else {
          changedBlocks.page.add(block);
        }
      }
    });
  }

  // collect changed saved blocks
  {
    const prevBlocksMap = getSavedBlocks(prevState);
    const currBlocksMap = getSavedBlocks(currState);
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      if (block !== prevBlocksMap[blockId]) {
        changedBlocks.saved.add(blockId);
      }
    });
  }

  // collect changed global blocks
  {
    const prevBlocksMap = getGlobalBlocks(prevState);
    const currBlocksMap = getGlobalBlocks(currState);
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      if (block !== prevBlocksMap[blockId]) {
        changedBlocks.global.add(blockId);
      }
    });
  }

  // console.log("changedBlocks", changedBlocks);

  enqueueTasks(changedBlocks, store, next, options);
}

const changedBlocksDebounced = debounceAdvanced({
  fn: changedBlocks,
  wait: DEBOUNCE_INTERVAL,
  memoizeArgs: [0],
  onFirstCall: () => taskQueue.stop(),
  onAfterFnCall: ({ fnArgs: [, store] }) => {
    if (isDesktopMode(store)) {
      taskQueue.start();
    }
  }
});

async function enqueueTasks(changedBlocks, store, next, options = {}) {
  const historyMeta = {
    historyReplacePresent: true
  };
  const pageBlockTasks = Array.from(changedBlocks.page).map(block => {
    const blockId = block.value._id;

    return {
      id: blockId,
      priority: taskQueue.taskPriorities.NORMAL,
      cb: async enqueueAgain => {
        // console.log("block screen cb", blockId);

        // make screenshot
        if (!blockIsInThePage(blockId, store)) {
          return;
        }
        let screenshotId = blockId;
        let screenshot;
        try {
          screenshot = await makeBlockScreenshot(block);
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(e);
          }
        }

        // upload screenshot
        if (!blockIsInThePage(blockId, store)) {
          return;
        }
        if (!isDesktopMode(store)) {
          enqueueAgain();
          return;
        }
        const r = await uploadBlockScreenshot({
          block,
          screenshotId,
          screenshotBase64: screenshot.src
        });
        if (TARGET !== "WP") {
          screenshotId = r.id;
        }

        // update store
        if (!blockIsInThePage(blockId, store)) {
          return;
        }
        const pageData = getPageData(store.getState());
        const pageBlocks = pageData.items || [];
        const updatedBlocks = pageBlocks.map(block => {
          return block.value._id === blockId
            ? updateBlockWithScreenshotInfo({
                block,
                src: screenshotId,
                width: screenshot.width,
                height: screenshot.height
              })
            : block;
        });
        next(
          updatePage({
            data: {
              ...pageData,
              items: updatedBlocks
            },
            meta: historyMeta
          })
        );
      }
    };
  });
  const savedBlockTasks = Array.from(changedBlocks.saved).map(savedBlockId => {
    return {
      id: savedBlockId,
      priority: taskQueue.taskPriorities.IMMEDIATE,
      cb: async enqueueAgain => {
        let block;

        // make screenshot
        block = getSavedBlocks(store.getState())[savedBlockId];
        if (!block) {
          return;
        }
        let screenshotId = savedBlockId;
        let screenshot;
        try {
          screenshot = await makeBlockScreenshot(block);
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(e);
          }
        }

        // upload screenshot
        block = getSavedBlocks(store.getState())[savedBlockId];
        if (!block) {
          return;
        }
        if (!isDesktopMode(store)) {
          enqueueAgain();
          return;
        }
        const r = await uploadBlockScreenshot({
          block,
          blockType: "global",
          screenshotId,
          screenshotBase64: screenshot.src
        });
        if (TARGET !== "WP") {
          screenshotId = r.id;
        }

        // update store (saved blocks)
        block = getSavedBlocks(store.getState())[savedBlockId];
        if (!block) {
          return;
        }
        next(
          updateSavedBlock({
            id: savedBlockId,
            data: updateBlockWithScreenshotInfo({
              block,
              src: screenshotId,
              width: screenshot.width,
              height: screenshot.height
            }),
            meta: historyMeta
          })
        );
      }
    };
  });
  const globalBlockTasks = Array.from(changedBlocks.global).map(
    globalBlockId => {
      return {
        id: globalBlockId,
        priority: taskQueue.taskPriorities.NORMAL,
        cb: async enqueueAgain => {
          // console.log("global block screen cb", globalBlockId);

          const refBlock = getPageBlocks(store.getState()).find(
            block =>
              block.type === "GlobalBlock" &&
              block.value.globalBlockId === globalBlockId
          );

          // abort if the block is no longer in the page
          if (!refBlock) {
            return;
          }

          // make screenshot
          let screenshotId = globalBlockId;
          let screenshot;
          try {
            screenshot = await makeBlockScreenshot(refBlock);
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.warn(e);
            }
          }

          // upload screenshot
          if (!isDesktopMode(store)) {
            enqueueAgain();
            return;
          }
          const r = await uploadBlockScreenshot({
            block: refBlock,
            blockType: "global",
            screenshotId,
            screenshotBase64: screenshot.src
          });
          if (TARGET !== "WP") {
            screenshotId = r.id;
          }

          // update store (globalBlocks)
          const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
          if (!globalBlock) {
            return;
          }
          next(
            updateGlobalBlock({
              id: globalBlockId,
              data: updateBlockWithScreenshotInfo({
                block: globalBlock,
                src: screenshotId,
                width: screenshot.width,
                height: screenshot.height
              }),
              meta: {
                ...historyMeta,
                is_autosave: options.globalIsAutosave === false ? 0 : 1
              }
            })
          );
        }
      };
    }
  );
  const allTasks = [...pageBlockTasks, ...savedBlockTasks, ...globalBlockTasks];

  if (allTasks.length > 0) {
    taskQueue.enqueue(allTasks);
  }
}
