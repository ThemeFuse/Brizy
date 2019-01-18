import _ from "underscore";
import { uuid } from "visual/utils/uuid";
import {
  EDITOR_RENDERED,
  UPDATE_PAGE,
  UPDATE_GLOBALS
} from "visual/redux/actionTypes";
import { ActionTypes as HistoryActionTypes } from "visual/redux/reducers/historyEnhancer";
import { updatePage, updateGlobals } from "visual/redux/actionCreators";
import {
  pageDataSelector as getPageData,
  pageBlocksSelector as getPageBlocks,
  savedBlocksSelector as getSavedBlocks,
  globalBlocksSelector as getGlobalBlocks
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
const blockIsInSaved = (block, store) =>
  getSavedBlocks(store.getState()).includes(block); // saved blocks do not have their own uuid so we look by reference

export default store => next => action => {
  const prevState = store.getState();
  next(action);

  const { ui } = store.getState();
  if (ui.deviceMode !== "desktop") {
    return;
  }

  if (
    action.type === EDITOR_RENDERED ||
    (action.type === UPDATE_GLOBALS && action.key === "styles")
  ) {
    allBlocksDebounced(store, next);
  }

  if (
    action.type === UPDATE_PAGE ||
    (action.type === UPDATE_GLOBALS && action.key === "globalBlocks") ||
    action.type === UNDO ||
    action.type === REDO
  ) {
    changedBlocksDebounced(prevState, store, next);
  }

  if (action.type === UPDATE_GLOBALS && action.key === "savedBlocks") {
    changedBlocks(prevState, store, next);
  }
};

function allBlocks(store, next) {
  const changedBlocks = {
    page: [],
    saved: [],
    global: []
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
        changedBlocks.global.push(block.value.globalBlockId);
      } else {
        changedBlocks.page.push(block);
      }
    });
  }

  enqueueTasks(changedBlocks, store, next);
}

const allBlocksDebounced = _.debounce(allBlocks, DEBOUNCE_INTERVAL);

function changedBlocks(prevState, store, next) {
  const changedBlocks = {
    page: [],
    saved: [],
    global: []
  };

  const currState = store.getState();

  // collect changed page blocks
  {
    const prevBlocksMap = getBlocksMap(getPageBlocks(prevState));
    const currBlocksMap = getBlocksMap(getPageBlocks(currState));
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      // if (block.type === "SectionPopup") {
      //   console.log("skipping section popup");
      //   return;
      // }

      if (block !== prevBlocksMap[blockId]) {
        if (block.type === "GlobalBlock") {
          changedBlocks.global.push(block.value.globalBlockId);
        } else {
          changedBlocks.page.push(block);
        }
      }
    });
  }

  // collect changed saved blocks
  {
    const prevBlocksMap = getBlocksMap(getSavedBlocks(prevState));
    const currBlocksMap = getBlocksMap(getSavedBlocks(currState));
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      if (block !== prevBlocksMap[blockId]) {
        changedBlocks.saved.push(block);
      }
    });
  }

  // collect changed global blocks
  {
    const prevBlocksMap = getGlobalBlocks(prevState);
    const currBlocksMap = getGlobalBlocks(currState);
    Object.entries(currBlocksMap).forEach(([blockId, block]) => {
      if (block !== prevBlocksMap[blockId]) {
        changedBlocks.global.push(blockId);
      }
    });
  }

  // console.log("changedBlocks", changedBlocks);

  enqueueTasks(changedBlocks, store, next);
}

const changedBlocksDebounced = debounceAdvanced({
  fn: changedBlocks,
  wait: DEBOUNCE_INTERVAL,
  memoizeArgs: [0],
  onFirstCall: () => taskQueue.stop(),
  onAfterFnCall: () => taskQueue.start()
});

async function enqueueTasks(changedBlocks, store, next) {
  const historyMeta = {
    historyReplacePresent: true
  };
  const pageBlockTasks = changedBlocks.page.map(block => {
    const blockId = block.value._id;

    return {
      id: blockId,
      priority: taskQueue.taskPriorities.NORMAL,
      cb: async () => {
        // console.log("block screen cb", blockId);

        // make screenshot
        if (!blockIsInThePage(blockId, store)) {
          return;
        }
        const screenshotId = blockId;
        let screenshot;
        try {
          screenshot = await makeBlockScreenshot(block);
        } catch (e) {
          console.log(e);
        }

        // upload screenshot
        if (!blockIsInThePage(blockId, store)) {
          return;
        }
        await uploadBlockScreenshot({
          screenshotId,
          screenshotBase64: screenshot.src
        });

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
          updatePage(
            {
              data: {
                ...pageData,
                items: updatedBlocks
              }
            },
            historyMeta
          )
        );
      }
    };
  });
  const savedBlockTasks = changedBlocks.saved.map(block => {
    const blockId = uuid();

    return {
      id: blockId,
      priority: taskQueue.taskPriorities.IMMEDIATE,
      cb: async () => {
        // console.log("saved block screen cb", blockId);

        // make screenshot
        const screenshotId = blockId;
        const screenshot = await makeBlockScreenshot(block);

        // upload screenshot
        if (!blockIsInSaved(block, store)) {
          return;
        }
        await uploadBlockScreenshot({
          blockType: "global",
          screenshotId,
          screenshotBase64: screenshot.src
        });

        // update store (saved blocks)
        if (!blockIsInSaved(block, store)) {
          return;
        }
        const savedBlocks = getSavedBlocks(store.getState());
        const updatedBlocks = savedBlocks.map(block_ => {
          return block_ === block
            ? updateBlockWithScreenshotInfo({
                block,
                src: screenshotId,
                width: screenshot.width,
                height: screenshot.height
              })
            : block_;
        });
        next(updateGlobals("savedBlocks", updatedBlocks, historyMeta));
      }
    };
  });
  const globalBlockTasks = changedBlocks.global.map(globalBlockId => {
    return {
      id: globalBlockId,
      priority: taskQueue.taskPriorities.NORMAL,
      cb: async () => {
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
        const screenshotId = globalBlockId;
        const screenshot = await makeBlockScreenshot(refBlock);

        // upload screenshot
        await uploadBlockScreenshot({
          blockType: "global",
          screenshotId,
          screenshotBase64: screenshot.src
        });

        // update store (page)
        const pageData = getPageData(store.getState());
        const pageBlocks = pageData.items || [];
        const updatedBlocks = pageBlocks.map(block => {
          return block.type == "GlobalBlock" &&
            block.value.globalBlockId === globalBlockId
            ? updateBlockWithScreenshotInfo({
                block,
                src: screenshotId,
                width: screenshot.width,
                height: screenshot.height
              })
            : block;
        });
        next(
          updatePage(
            {
              data: {
                ...pageData,
                items: updatedBlocks
              }
            },
            historyMeta
          )
        );

        // update store (globalBlocks)
        const globalBlocks = getGlobalBlocks(store.getState());
        if (!globalBlocks[globalBlockId]) {
          return;
        }
        const updatedGlobalBlocks = {
          ...globalBlocks,
          [globalBlockId]: updateBlockWithScreenshotInfo({
            block: globalBlocks[globalBlockId],
            src: screenshotId,
            width: screenshot.width,
            height: screenshot.height
          })
        };
        next(updateGlobals("globalBlocks", updatedGlobalBlocks, historyMeta));
      }
    };
  });
  const allTasks = [...pageBlockTasks, ...savedBlockTasks, ...globalBlockTasks];

  if (allTasks.length > 0) {
    taskQueue.enqueue(allTasks);
  }
}
