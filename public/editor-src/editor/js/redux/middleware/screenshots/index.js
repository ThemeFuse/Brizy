import _ from "underscore";
import { getIn } from "timm";
import { findDeep } from "visual/utils/object";
import {
  createBlockScreenshot as apiCreateBlockScreenshot,
  updateBlockScreenshot as apiUpdateBlockScreenshot
} from "visual/utils/api/editor";
import {
  EDITOR_RENDERED,
  UPDATE_UI,
  UPDATE_PAGE,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  UPDATE_EXTRA_FONT_STYLES,
  IMPORT_TEMPLATE,
  ADD_BLOCK
} from "visual/redux/actions";
import { ActionTypes as HistoryActionTypes } from "visual/redux/reducers/historyEnhancer";
import { updateScreenshot } from "visual/redux/actions";
import {
  pageDataSelector as getPageData,
  pageBlocksSelector as getPageBlocks,
  savedBlocksSelector as getSavedBlocks,
  globalBlocksSelector as getGlobalBlocks,
  globalBlocksUpdatesSelector as getGlobalBlocksUpdates,
  screenshotsSelector,
  deviceModeSelector
} from "visual/redux/selectors";
import { makeBlockScreenshot, makeTaskQueue, debounceAdvanced } from "./utils";

export { browserSupportsScreenshots } from "./browserSupportsScreenshots";

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
    action.type === UPDATE_CURRENT_STYLE_ID ||
    action.type === UPDATE_CURRENT_STYLE ||
    action.type === UPDATE_EXTRA_FONT_STYLES ||
    action.type === IMPORT_TEMPLATE
  ) {
    allBlocksDebounced(store, next);
  }

  if (!isDesktopMode(store)) {
    return;
  }

  if (
    action.type === UPDATE_PAGE ||
    action.type === ADD_BLOCK ||
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
      taskIdSuffix: "_create",
      sourceBlockId: action.meta.sourceBlockId,
      isAutosave: 0,

      // there are currently problems if we would make
      // global blocks also of IMMEDIATE priority because
      // by the time the block will be screenshoted it is be
      // highly likely that it would be incomplete because
      // of the unmounting that happens when transforming
      // a normal block to a global one
      taskPriority:
        action === CREATE_SAVED_BLOCK
          ? taskQueue.taskPriorities.IMMEDIATE
          : taskQueue.taskPriorities.HIGH
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

    for (const block of currBlocks) {
      if (block.type === "SectionPopup") {
        return;
      }

      if (block.type === "GlobalBlock") {
        changedBlocks.global.add(block.value.globalBlockId);
      } else {
        changedBlocks.page.add(block);
      }
    }
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
    const prevGlobalBlocks = getGlobalBlocks(prevState);
    const prevGlobalBlocksUpdates = getGlobalBlocksUpdates(prevState);
    const currGlobalBlocks = getGlobalBlocks(currState);
    const currGlobalBlocksUpdates = getGlobalBlocksUpdates(currState);

    for (const [blockId, block] of Object.entries(currBlocksMap)) {
      if (block.type !== "GlobalBlock") {
        if (block !== prevBlocksMap[blockId]) {
          changedBlocks.page.add(block);
        }
      } else {
        const gbid = block.value.globalBlockId;

        if (
          currGlobalBlocks[gbid] !== prevGlobalBlocks[gbid] ||
          currGlobalBlocksUpdates[gbid] !== prevGlobalBlocksUpdates[gbid]
        ) {
          changedBlocks.global.add(gbid);
        }
      }
    }
  }

  // collect changed saved blocks
  {
    const prevSavedBlocks = getSavedBlocks(prevState);
    const currSavedBlocks = getSavedBlocks(currState);

    for (const blockId of Object.keys(currSavedBlocks)) {
      if (currSavedBlocks[blockId] !== prevSavedBlocks[blockId]) {
        changedBlocks.saved.add(blockId);
      }
    }
  }

  // collect changed global blocks
  {
    const prevGlobalBlocks = getGlobalBlocks(prevState);
    const prevGlobalBlocksUpdates = getGlobalBlocksUpdates(prevState);
    const currGlobalBlocks = getGlobalBlocks(currState);
    const currGlobalBlocksUpdates = getGlobalBlocksUpdates(currState);

    for (const gbid of Object.keys(currGlobalBlocks)) {
      if (
        currGlobalBlocks[gbid] !== prevGlobalBlocks[gbid] ||
        currGlobalBlocksUpdates[gbid] !== prevGlobalBlocksUpdates[gbid]
      ) {
        changedBlocks.global.add(gbid);
      }
    }
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
  const blockId = block.value._id;
  let screenshotId;
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

    const screenshots = screenshotsSelector(store.getState());
    if (!screenshots[blockId]) {
      const r = await apiCreateBlockScreenshot({
        base64: screenshot.src,
        blockType: "normal"
      });

      screenshotId = r.id;
    } else {
      screenshotId = screenshots[blockId]._thumbnailSrc;

      await apiUpdateBlockScreenshot({
        id: screenshotId,
        base64: screenshot.src,
        blockType: "normal"
      });
    }
  }

  // update store
  {
    if (!blockIsInThePage(blockId, store)) {
      return;
    }

    next(
      updateScreenshot({
        blockId,
        data: {
          _thumbnailSrc: screenshotId,
          _thumbnailWidth: screenshot.width,
          _thumbnailHeight: screenshot.height,
          _thumbnailTime: Date.now()
        },
        meta: {
          blockType: "normal"
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
  let screenshotId;
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

    const r = await apiCreateBlockScreenshot({
      base64: screenshot.src,

      // ATTENTION: this is used only for WP and is
      // deliberately set to global because in the WP plugin
      // we store global, saved and popup block screenshots in the "global" folder.
      blockType: "global"
    });
    screenshotId = r.id;
  }

  // update store (saved blocks)
  {
    const block = getSavedBlocks(store.getState())[savedBlockId];
    if (!block) {
      return;
    }

    next(
      updateScreenshot({
        blockId: savedBlockId,
        data: {
          _thumbnailSrc: screenshotId,
          _thumbnailWidth: screenshot.width,
          _thumbnailHeight: screenshot.height,
          _thumbnailTime: Date.now()
        },
        meta: {
          blockType: "saved"
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
  let screenshotId;
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

    const screenshots = screenshotsSelector(store.getState());
    const publishedScreenshot =
      screenshots._published[globalBlockId] &&
      screenshots._published[globalBlockId]._thumbnailSrc;
    const latestScreenshot =
      screenshots[globalBlockId] && screenshots[globalBlockId]._thumbnailSrc;
    if (!publishedScreenshot || publishedScreenshot === latestScreenshot) {
      const r = await apiCreateBlockScreenshot({
        base64: screenshot.src,

        // ATTENTION: this is used only for WP and is
        // deliberately set to global because in the WP plugin
        // we store global, saved and popup block screenshots in the "global" folder.
        blockType: "global"
      });

      screenshotId = r.id;
    } else {
      screenshotId = latestScreenshot;

      await apiUpdateBlockScreenshot({
        id: screenshotId,
        base64: screenshot.src,

        // ATTENTION: this is used only for WP and is
        // deliberately set to global because in the WP plugin
        // we store global, saved and popup block screenshots in the "global" folder.
        blockType: "global"
      });
    }
  }

  // update store (globalBlocks)
  {
    const globalBlock = getGlobalBlocks(store.getState())[globalBlockId];
    if (!globalBlock) {
      return;
    }

    next(
      updateScreenshot({
        blockId: globalBlockId,
        data: {
          _thumbnailSrc: screenshotId,
          _thumbnailWidth: screenshot.width,
          _thumbnailHeight: screenshot.height,
          _thumbnailTime: Date.now()
        },
        meta: {
          blockType: "global",
          action: options.isAutosave === 0 ? "create" : "update"
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
  let screenshotId;
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

    const screenshots = screenshotsSelector(store.getState());
    const publishedScreenshot =
      screenshots._published[popupId] &&
      screenshots._published[popupId]._thumbnailSrc;
    const latestScreenshot =
      screenshots[popupId] && screenshots[popupId]._thumbnailSrc;
    if (!latestScreenshot || latestScreenshot === publishedScreenshot) {
      const r = await apiCreateBlockScreenshot({
        base64: screenshot.src,

        // ATTENTION: this is used only for WP and is
        // deliberately set to global because in the WP plugin
        // we store global, saved and popup block screenshots in the "global" folder.
        blockType: "global"
      });

      screenshotId = r.id;
    } else {
      screenshotId = latestScreenshot;

      await apiUpdateBlockScreenshot({
        id: screenshotId,
        base64: screenshot.src,

        // ATTENTION: this is used only for WP and is
        // deliberately set to global because in the WP plugin
        // we store global, saved and popup block screenshots in the "global" folder.
        blockType: "global"
      });
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

    next(
      updateScreenshot({
        blockId: popupId,
        data: {
          _thumbnailSrc: screenshotId,
          _thumbnailWidth: screenshot.width,
          _thumbnailHeight: screenshot.height,
          _thumbnailTime: Date.now()
        },
        meta: {
          blockType: "popup"
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
  const popupIsGlobal = popup === globalBlock;
  let screenshotId;
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

    if (!popup.value._thumbnailSrc) {
      // if the popup block doesn't have a screenshot yet, create one

      const r = await apiCreateBlockScreenshot({
        base64: screenshot.src,
        blockType: popupIsGlobal ? "global" : "normal"
      });

      screenshotId = r.id;
    } else {
      // if it does then we must be careful not to overwrite the published screenshot
      // with an draft version of the block because the user may wish not to publish
      // the changes which will result with an invalid updated screenshot

      const publishedScreenshot = screenshotsSelector(store.getState())
        ._published[popupIsGlobal ? globalBlockId : popupId];

      if (
        publishedScreenshot &&
        popup.value._thumbnailSrc === publishedScreenshot._thumbnailSrc
      ) {
        const r = await apiCreateBlockScreenshot({
          base64: screenshot.src,
          blockType: popupIsGlobal ? "global" : "normal"
        });

        screenshotId = r.id;
      } else {
        screenshotId = popup.value._thumbnailSrc;

        await apiUpdateBlockScreenshot({
          id: screenshotId,
          base64: screenshot.src,
          blockType: popupIsGlobal ? "global" : "normal"
        });
      }
    }
  }

  // update store
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

    next(
      updateScreenshot({
        blockId: popupIsGlobal ? globalBlockId : popupId,
        data: {
          _thumbnailSrc: screenshotId,
          _thumbnailWidth: screenshot.width,
          _thumbnailHeight: screenshot.height,
          _thumbnailTime: Date.now()
        },
        meta: {
          blockType: "popup"
        }
      })
    );
  }
}
