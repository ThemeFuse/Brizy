import _ from "underscore";
import { getIn, updateIn } from "timm";
import { findDeep } from "visual/utils/object";
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
  stripBlockOfScreenshotInfo,
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
    let options;

    if (action.meta) {
      options = {
        popup: action.meta.SectionPopup,
        sourceBlockId: action.meta.sourceBlockId
      };
    }

    changedBlocksDebounced(prevState, store, next, options);
  }

  if (
    action.type === CREATE_SAVED_BLOCK ||
    action.type === CREATE_GLOBAL_BLOCK
  ) {
    const options = {
      taskIdSuffix: "create",
      sourceBlockId: action.meta.sourceBlockId,
      isAutosave: 0,
      renewScreenshot: true
    };

    if (action === CREATE_SAVED_BLOCK) {
      // there are currently problems if we would make
      // global blocks also of IMMEDIATE priority because
      // by the time the block will be screenshoted it is be
      // highly likely that it would be incomplete because
      // of the unmounting that happens when transforming
      // a normal block to a global one
      options.taskPriority = taskQueue.taskPriorities.IMMEDIATE;
    }

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
  const pageBlockTasks = Array.from(changedBlocks.page).map(block => {
    return {
      id: block.value._id + (options.taskIdSuffix || ""),
      priority:
        options.taskPriority !== undefined
          ? options.taskPriority
          : taskQueue.taskPriorities.NORMAL,
      cb: options.popup ? popupBlockTaskCb : pageBlockTaskCb,
      cbArgs: [store, next, options, block]
    };
  });
  const savedBlockTasks = Array.from(changedBlocks.saved).map(savedBlockId => {
    return {
      id: savedBlockId + (options.taskIdSuffix || ""),
      priority:
        options.taskPriority !== undefined
          ? options.taskPriority
          : taskQueue.taskPriorities.NORMAL,
      cb: savedBlockTaskCb,
      cbArgs: [store, next, options, savedBlockId]
    };
  });
  const globalBlockTasks = Array.from(changedBlocks.global).map(
    globalBlockId => {
      return {
        id: globalBlockId + (options.taskIdSuffix || ""),
        priority:
          options.taskPriority !== undefined
            ? options.taskPriority
            : taskQueue.taskPriorities.NORMAL,
        cb: options.popup
          ? popupBlockInsideGlobalBlockTaskCb
          : globalBlockTaskCb,
        // cb: globalBlockTaskCb,
        cbArgs: [store, next, options, globalBlockId]
      };
    }
  );
  const allTasks = [...pageBlockTasks, ...savedBlockTasks, ...globalBlockTasks];

  if (allTasks.length > 0) {
    taskQueue.enqueue(allTasks);
  }
}
async function pageBlockTaskCb(store, next, options, block, enqueueAgain) {
  // console.log("block screen cb", blockId);
  const blockId = block.value._id;
  let screenshotId = blockId;
  let screenshot;

  // make screenshot
  {
    if (!blockIsInThePage(blockId, store)) {
      return;
    }

    try {
      screenshot = await makeBlockScreenshot(block);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(e);
      }
      return;
    }
  }

  // upload screenshot
  {
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
  }

  // update store
  {
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
        meta: {
          historyReplacePresent: true
        }
      })
    );
  }
}
async function savedBlockTaskCb(
  store,
  next,
  options,
  savedBlockId,
  enqueueAgain
) {
  let screenshotId = savedBlockId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`#${options.sourceBlockId}`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeBlockScreenshot(null, { node });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(e);
      }
      return;
    }
  }

  // upload screenshot
  {
    const block = getSavedBlocks(store.getState())[savedBlockId];
    if (!block) {
      return;
    }

    if (!isDesktopMode(store)) {
      enqueueAgain();
      return;
    }

    const r = await uploadBlockScreenshot({
      block: options.renewScreenshot
        ? stripBlockOfScreenshotInfo(block)
        : block,
      blockType: "global",
      screenshotId,
      screenshotBase64: screenshot.src
    });
    if (TARGET !== "WP") {
      screenshotId = r.id;
    }
  }

  // update store (saved blocks)
  {
    const block = getSavedBlocks(store.getState())[savedBlockId];
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
        meta: {
          is_autosave:
            options.isAutosave !== undefined ? options.isAutosave : 1,
          historyReplacePresent: true
        }
      })
    );
  }
}
async function globalBlockTaskCb(
  store,
  next,
  options,
  globalBlockId,
  enqueueAgain
) {
  // console.log("global block screen cb", globalBlockId);
  let screenshotId = globalBlockId;
  let screenshot;

  // make screenshot
  {
    let sourceBlockId;
    if (options.sourceBlockId) {
      sourceBlockId = options.sourceBlockId;
    } else {
      const pageData = getPageData(store.getState());
      const { obj: sourceBlock } = findDeep(
        pageData,
        obj => obj.value && obj.value.globalBlockId === globalBlockId
      );

      if (!sourceBlock) {
        return;
      }

      sourceBlockId = sourceBlock.value._id;
    }

    const node = document.querySelector(`#${sourceBlockId}`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeBlockScreenshot(null, { node });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(e);
      }
      return;
    }
  }

  // upload screenshot
  {
    const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
    if (!globalBlock) {
      return;
    }

    if (!isDesktopMode(store)) {
      enqueueAgain();
      return;
    }

    const r = await uploadBlockScreenshot({
      block: options.renewScreenshot
        ? stripBlockOfScreenshotInfo(globalBlock)
        : globalBlock,
      blockType: "global",
      screenshotId,
      screenshotBase64: screenshot.src,
      newScreenshot: options.newScreenshot
    });
    if (TARGET !== "WP") {
      screenshotId = r.id;
    }
  }

  // update store (globalBlocks)
  {
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
          is_autosave:
            options.isAutosave !== undefined ? options.isAutosave : 1,
          historyReplacePresent: true
        }
      })
    );
  }
}
async function popupBlockTaskCb(store, next, options, block, enqueueAgain) {
  const { path: pathToPopup_, domId: popupDOMId } = options.popup;
  // pathToPopup_ gets us to value, but we need one level higher
  // to the object containing { type, value }
  const pathToPopup = pathToPopup_.slice(0, -1);
  const pageData = getPageData(store.getState());
  const popup = getIn(pageData, pathToPopup);
  const popupId = popup.value._id;
  let screenshotId = popupId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`#${popupDOMId}`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeBlockScreenshot(null, { node });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(e);
      }
      return;
    }
  }

  // upload screenshot
  {
    const pageData = getPageData(store.getState());
    const popup = getIn(pageData, pathToPopup);
    const popupIsInPage = popup && popup.value && popup.value._id === popupId;
    if (!popupIsInPage) {
      return;
    }

    if (!isDesktopMode(store)) {
      enqueueAgain();
      return;
    }

    const r = await uploadBlockScreenshot({
      block: popup,
      screenshotId,
      screenshotBase64: screenshot.src
    });
    if (TARGET !== "WP") {
      screenshotId = r.id;
    }
  }

  // update store
  {
    const pageData = getPageData(store.getState());
    const popup = getIn(pageData, pathToPopup);
    const popupIsInPage = (popup && popup.value && popup.value._id) === popupId;
    if (!popupIsInPage) {
      return;
    }

    const newPageData = updateIn(pageData, pathToPopup, popup =>
      updateBlockWithScreenshotInfo({
        block: popup,
        src: screenshotId,
        width: screenshot.width,
        height: screenshot.height
      })
    );

    next(
      updatePage({
        data: newPageData,
        meta: {
          historyReplacePresent: true
        }
      })
    );
  }
}
async function popupBlockInsideGlobalBlockTaskCb(
  store,
  next,
  options,
  globalBlockId,
  enqueueAgain
) {
  const { domId: popupDOMId, dbId: popupDbId } = options.popup;
  const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
  const { obj: popup } = findDeep(
    globalBlock,
    obj => obj && obj.value && obj.value._id === popupDbId
  );
  const popupId = popup.value._id;
  let screenshotId = popup === globalBlock ? globalBlockId : popupId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`#${popupDOMId}`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeBlockScreenshot(null, { node });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(e);
      }
      return;
    }
  }

  // upload screenshot
  {
    const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
    const { obj: popup } = findDeep(
      globalBlock,
      obj => obj && obj.value && obj.value._id === popupDbId
    );
    const popupIsInPage = Boolean(popup);
    if (!popupIsInPage) {
      return;
    }

    if (!isDesktopMode(store)) {
      enqueueAgain();
      return;
    }

    const r = await uploadBlockScreenshot({
      block: popup,
      blockType: popup === globalBlock ? "global" : "normal",
      screenshotId,
      screenshotBase64: screenshot.src
    });
    if (TARGET !== "WP") {
      screenshotId = r.id;
    }
  }

  // update store
  {
    const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
    const { obj: popup, path } = findDeep(
      globalBlock,
      obj => obj && obj.value && obj.value._id === popupDbId
    );
    const popupIsInPage = Boolean(popup);
    if (!popupIsInPage) {
      return;
    }

    const newGlobalBlock = updateIn(globalBlock, path, popup =>
      updateBlockWithScreenshotInfo({
        block: popup,
        src: screenshotId,
        width: screenshot.width,
        height: screenshot.height
      })
    );

    next(
      updateGlobalBlock({
        id: globalBlockId,
        data: newGlobalBlock,
        meta: {
          is_autosave:
            options.isAutosave !== undefined ? options.isAutosave : 1,
          historyReplacePresent: true
        }
      })
    );
  }
}
