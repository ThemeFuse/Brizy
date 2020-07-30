import _ from "underscore";
import { getIn } from "timm";
import { findDeep } from "visual/utils/object";
import {
  createBlockScreenshot as apiCreateBlockScreenshot,
  updateBlockScreenshot as apiUpdateBlockScreenshot
} from "visual/utils/api/editor/index-new";
import {
  EDITOR_RENDERED,
  UPDATE_UI,
  UPDATE_BLOCKS,
  UPDATE_GLOBAL_BLOCK,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  IMPORT_TEMPLATE,
  ADD_BLOCK,
  ADD_GLOBAL_BLOCK
} from "visual/redux/actions";
import { UPDATE_EXTRA_FONT_STYLES } from "visual/redux/actions2";
import { UNDO, REDO } from "visual/redux/history/types";
import { updateScreenshot } from "visual/redux/actions";
import {
  pageBlocksSelector as getPageBlocks,
  globalBlocksSelector as getGlobalBlocks,
  blocksDataSelector as getBlocksData,
  screenshotsSelector,
  deviceModeSelector
} from "visual/redux/selectors";
import { makeNodeScreenshot } from "visual/utils/screenshots";
import { makeTaskQueue, debounceAdvanced } from "./utils";

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
    action.type === UPDATE_BLOCKS ||
    action.type === ADD_BLOCK ||
    action.type === ADD_GLOBAL_BLOCK ||
    action.type === UPDATE_GLOBAL_BLOCK ||
    action.type === UNDO ||
    action.type === REDO
  ) {
    let options;

    if (action.meta) {
      options = {
        popup: action.meta.SectionPopup || action.meta.SectionPopup2,
        sourceBlockId: action.meta.sourceBlockId
      };
    }

    changedBlocksDebounced(prevState, store, next, options);
  }
};

function allBlocks(store, next) {
  const changedBlocks = {
    page: new Set(),
    global: new Set()
  };

  const currState = store.getState();

  // collect page blocks
  {
    const currBlocks = getPageBlocks(currState);

    for (const block of currBlocks) {
      if (block.type === "SectionPopup" || block.type === "SectionPopup2") {
        return;
      }

      if (block.type === "GlobalBlock") {
        changedBlocks.global.add(block.value._id);
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
    global: new Set()
  };

  const currState = store.getState();

  // collect changed page blocks
  {
    const prevBlocksMap = getBlocksMap(getPageBlocks(prevState));
    const currBlocksMap = getBlocksMap(getPageBlocks(currState));

    const prevBlocksData = getBlocksData(prevState);
    const currBlocksData = getBlocksData(currState);

    for (const [blockId, block] of Object.entries(currBlocksMap)) {
      if (block.type !== "GlobalBlock") {
        if (block !== prevBlocksMap[blockId]) {
          changedBlocks.page.add(block);
        }
      } else {
        const gbid = block.value._id;

        if (currBlocksData[gbid] !== prevBlocksData[gbid]) {
          changedBlocks.global.add(gbid);
        }
      }
    }
  }

  // collect changed global blocks
  {
    const currGlobalBlocks = getGlobalBlocks(currState);

    const prevBlocksData = getBlocksData(prevState);
    const currBlocksData = getBlocksData(currState);

    for (const gbid of Object.keys(currGlobalBlocks)) {
      if (currBlocksData[gbid] !== prevBlocksData[gbid]) {
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
  const globalBlockTasks = Array.from(changedBlocks.global).map(_id => {
    return {
      id: _id + (options.taskIdSuffix || ""),
      priority:
        options.taskPriority !== undefined
          ? options.taskPriority
          : taskQueue.taskPriorities.NORMAL,
      cb: options.popup ? popupBlockInsideGlobalBlockTaskCb : globalBlockTaskCb,
      // cb: globalBlockTaskCb,
      cbArgs: [store, next, options, _id]
    };
  });
  const allTasks = [...pageBlockTasks, ...globalBlockTasks];

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
    const node = document.querySelector(`#${blockId}`);

    if (!blockIsInThePage(blockId, store) || !node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        /* eslint-disable no-console */
        console.warn(e);
        /* eslint-enabled no-console */
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
async function globalBlockTaskCb(store, next, options, _id, enqueueAgain) {
  let screenshotId;
  let screenshot;

  // make screenshot
  {
    let sourceBlockId;
    if (options.sourceBlockId) {
      sourceBlockId = options.sourceBlockId;
    } else {
      const pageBlocks = getPageBlocks(store.getState());
      const { obj: sourceBlock } = findDeep(
        pageBlocks,
        obj => obj.value && obj.value._id === _id
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
      screenshot = await makeNodeScreenshot(node);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        /* eslint-disable no-console */
        console.warn(e);
        /* eslint-enabled no-console */
      }
      return;
    }
  }

  // upload screenshot
  {
    const globalBlock = getGlobalBlocks(store.getState())[_id];
    if (!globalBlock) {
      return;
    }

    if (!isDesktopMode(store)) {
      enqueueAgain();
      return;
    }

    const screenshots = screenshotsSelector(store.getState());
    const publishedScreenshot =
      screenshots._published[_id] && screenshots._published[_id]._thumbnailSrc;
    const latestScreenshot = screenshots[_id] && screenshots[_id]._thumbnailSrc;
    if (!publishedScreenshot || publishedScreenshot === latestScreenshot) {
      const r = await apiCreateBlockScreenshot({
        base64: screenshot.src,

        // ATTENTION: this is used only for WP and is
        // deliberately set to global because in the WP plugin
        // we store global, popup block screenshots in the "global" folder.
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
        // we store global, popup block screenshots in the "global" folder.
        blockType: "global"
      });
    }
  }

  // update store (globalBlocks)
  {
    const globalBlock = getGlobalBlocks(store.getState())[_id];
    if (!globalBlock) {
      return;
    }

    next(
      updateScreenshot({
        blockId: _id,
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
  const { path, domId: popupDOMId } = options.popup;
  const pathToPopupInBlocks = path.slice(1, -1);
  const pageBlocks = getPageBlocks(store.getState());
  const popup = getIn(pageBlocks, pathToPopupInBlocks);
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
      screenshot = await makeNodeScreenshot(node);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        /* eslint-disable no-console */
        console.warn(e);
        /* eslint-enabled no-console */
      }
      return;
    }
  }

  // upload screenshot
  {
    const pageBlocks = getPageBlocks(store.getState());
    const popup = getIn(pageBlocks, pathToPopupInBlocks);
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
        // we store global, popup block screenshots in the "global" folder.
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
        // we store global, popup block screenshots in the "global" folder.
        blockType: "global"
      });
    }
  }

  // update store
  {
    const pageBlocks = getPageBlocks(store.getState());
    const popup = getIn(pageBlocks, pathToPopupInBlocks);
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
  const { obj: popupData } = findDeep(
    globalBlock,
    obj => obj && obj.value && obj.value._id === popupDbId
  );
  const popupId = popupData.value._id;
  const popupIsGlobal = popupData === globalBlock.data;
  let screenshotId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`#${popupDOMId}`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        /* eslint-disable no-console */
        console.warn(e);
        /* eslint-enabled no-console */
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
