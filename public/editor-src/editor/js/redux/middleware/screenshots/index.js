import { debounce } from "es-toolkit";
import { getIn } from "timm";
import {
  ADD_BLOCK,
  EDITOR_RENDERED,
  UPDATE_BLOCKS,
  UPDATE_GLOBAL_BLOCK,
  UPDATE_UI
} from "visual/redux/actions";
import {
  ADD_GLOBAL_BLOCK,
  ADD_GLOBAL_POPUP,
  UPDATE_EXTRA_FONT_STYLES,
  updateScreenshot
} from "visual/redux/actions2";
import { REDO, UNDO } from "visual/redux/history/types";
import {
  deviceModeSelector,
  blocksDataSelector as getBlocksData,
  globalBlocksSelector as getGlobalBlocks,
  pageBlocksSelector as getPageBlocks,
  globalBlocksAssembledSelector,
  screenshotsSelector
} from "visual/redux/selectors";
import {
  createBlockScreenshot as apiCreateBlockScreenshot,
  updateBlockScreenshot as apiUpdateBlockScreenshot
} from "visual/utils/api";
import { createFullModelPath } from "visual/utils/models";
import { findDeep } from "visual/utils/object";
import { makeTaskQueue } from "visual/utils/queue/taskQueue";
import {
  isScreenshotSupported,
  makeNodeScreenshot
} from "visual/utils/screenshots";
import { ActionTypes } from "../../actions2";
import { debounceAdvanced } from "./utils";

const TASK_QUEUE_INTERVAL = 2000;
const DEBOUNCE_INTERVAL = 2000;

const taskQueue = makeTaskQueue({
  interval: TASK_QUEUE_INTERVAL
});
const getBlocksMap = (blocks) =>
  blocks.reduce((acc, block) => {
    acc[block.value._id] = block;
    return acc;
  }, {});
const blockIsInThePage = (blockId, store) =>
  Boolean(getBlocksMap(getPageBlocks(store.getState()))[blockId]);

const isDesktopMode = (store) =>
  deviceModeSelector(store.getState()) === "desktop";

export default (getConfig) => (store) => (next) => (action) => {
  const prevState = store.getState();
  next(action);

  const config = getConfig();

  (async () => {
    const screenshotsSupported = await isScreenshotSupported(config);

    if (screenshotsSupported) {
      screenshotMiddleware({ prevState, store, getConfig, next, action });
    }
  })();
};

function screenshotMiddleware(data) {
  const { prevState, store, getConfig, next, action } = data;

  if (action.type === UPDATE_UI && action.key === "deviceMode") {
    if (action.value === "desktop") {
      taskQueue.start();
    } else {
      taskQueue.stop();
    }
  }

  if (
    action.type === EDITOR_RENDERED ||
    action.type === ActionTypes.UPDATE_CURRENT_STYLE_ID ||
    action.type === ActionTypes.UPDATE_CURRENT_STYLE ||
    action.type === UPDATE_EXTRA_FONT_STYLES ||
    action.type === ActionTypes.IMPORT_TEMPLATE
  ) {
    allBlocksDebounced(store, getConfig, next);
  }

  if (!isDesktopMode(store)) {
    return;
  }

  if (
    action.type === UPDATE_BLOCKS ||
    action.type === ADD_BLOCK ||
    action.type === ADD_GLOBAL_BLOCK ||
    action.type === ADD_GLOBAL_POPUP ||
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

    changedBlocksDebounced(prevState, store, getConfig, next, options);
  }
}

function allBlocks(store, getConfig, next) {
  const changedBlocks = {
    page: new Set(),
    global: new Set()
  };

  const config = getConfig();
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

  enqueueTasks(changedBlocks, store, config, next);
}

const allBlocksDebounced = debounce(allBlocks, DEBOUNCE_INTERVAL);

function changedBlocks(prevState, store, getConfig, next, options) {
  const changedBlocks = {
    page: new Set(),
    global: new Set()
  };

  const config = getConfig();
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

  enqueueTasks(changedBlocks, store, config, next, options);
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

async function enqueueTasks(changedBlocks, store, config, next, options = {}) {
  const pageBlockTasks = Array.from(changedBlocks.page).map((block) => {
    return {
      id: block.value._id + (options.taskIdSuffix || ""),
      priority:
        options.taskPriority !== undefined
          ? options.taskPriority
          : taskQueue.taskPriorities.NORMAL,
      cb: options.popup ? popupBlockTaskCb : pageBlockTaskCb,
      cbArgs: [store, config, next, options, block]
    };
  });
  const globalBlockTasks = Array.from(changedBlocks.global).map((_id) => {
    return {
      id: _id + (options.taskIdSuffix || ""),
      priority:
        options.taskPriority !== undefined
          ? options.taskPriority
          : taskQueue.taskPriorities.NORMAL,
      cb: options.popup ? popupBlockInsideGlobalBlockTaskCb : globalBlockTaskCb,
      // cb: globalBlockTaskCb,
      cbArgs: [store, config, next, options, _id]
    };
  });
  const allTasks = [...pageBlockTasks, ...globalBlockTasks];

  if (allTasks.length > 0) {
    taskQueue.enqueue(allTasks);
  }
}
async function pageBlockTaskCb(
  store,
  config,
  next,
  options,
  block,
  enqueueAgain
) {
  const blockId = block.value._id;
  let screenshotId;
  let screenshot;

  // make screenshot
  {
    // if 'blockId' starts from number - document.getElementById(_id) will throw an error.
    // Because while they are valid in the HTML5 spec,
    // they are not valid in CSS, which is what "query selector" means.
    // document.querySelector(`id=['${_id}']`) - was added for that case
    const node = document.querySelector(`[id='${blockId}']`);

    if (!blockIsInThePage(blockId, store) || !node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node, config);
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
      const r = await apiCreateBlockScreenshot(
        { base64: screenshot.src, blockType: "normal" },
        config
      );

      screenshotId = r.id;
    } else {
      screenshotId = screenshots[blockId]._thumbnailSrc;

      await apiUpdateBlockScreenshot(
        { id: screenshotId, base64: screenshot.src, blockType: "normal" },
        config
      );
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
async function globalBlockTaskCb(
  store,
  config,
  next,
  options,
  _id,
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
      const pageBlocks = getPageBlocks(store.getState());
      const { obj: sourceBlock } = findDeep(
        pageBlocks,
        (obj) => obj.value && obj.value._id === _id
      );

      if (!sourceBlock) {
        return;
      }

      sourceBlockId = sourceBlock.value._id;
    }

    const node = document.querySelector(`[id='${sourceBlockId}']`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node, config);
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
      const r = await apiCreateBlockScreenshot(
        {
          base64: screenshot.src,

          // ATTENTION: this is used only for WP and is
          // deliberately set to global because in the WP plugin
          // we store global, popup block screenshots in the "global" folder.
          blockType: "global"
        },
        config
      );

      screenshotId = r.id;
    } else {
      screenshotId = latestScreenshot;

      await apiUpdateBlockScreenshot(
        {
          id: screenshotId,
          base64: screenshot.src,

          // ATTENTION: this is used only for WP and is
          // deliberately set to global because in the WP plugin
          // we store global, popup block screenshots in the "global" folder.
          blockType: "global"
        },
        config
      );
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
async function popupBlockTaskCb(
  store,
  config,
  next,
  options,
  block,
  enqueueAgain
) {
  const { dbId: popupDBId, domId: popupDOMId } = options.popup;
  const pageBlocks = getPageBlocks(store.getState());
  const path = createFullModelPath(pageBlocks, [popupDBId]);
  const pathToPopupInBlocks = path.slice(0, -1);
  const popup = getIn(pageBlocks, pathToPopupInBlocks);
  const popupId = popup.value._id;
  let screenshotId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`[id='${popupDOMId}']`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node, config);
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
      const r = await apiCreateBlockScreenshot(
        {
          base64: screenshot.src,

          // ATTENTION: this is used only for WP and is
          // deliberately set to global because in the WP plugin
          // we store global, popup block screenshots in the "global" folder.
          blockType: "global"
        },
        config
      );

      screenshotId = r.id;
    } else {
      screenshotId = latestScreenshot;

      await apiUpdateBlockScreenshot(
        {
          id: screenshotId,
          base64: screenshot.src,

          // ATTENTION: this is used only for WP and is
          // deliberately set to global because in the WP plugin
          // we store global, popup block screenshots in the "global" folder.
          blockType: "global"
        },
        config
      );
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
  config,
  next,
  options,
  globalBlockId,
  enqueueAgain
) {
  const { domId: popupDOMId, dbId: popupDbId } = options.popup;
  const globalBlock = globalBlocksAssembledSelector(store.getState())[
    globalBlockId
  ];

  if (!globalBlock) {
    return;
  }

  const { obj: popupData } = findDeep(
    globalBlock,
    (obj) => obj && obj.value && obj.value._id === popupDbId
  );

  if (!popupData) {
    return;
  }

  const popupId = popupData.value._id;
  const popupIsGlobal = popupData === globalBlock.data;
  let screenshotId;
  let screenshot;

  // make screenshot
  {
    const node = document.querySelector(`[id='${popupDOMId}']`);
    if (!node) {
      return;
    }

    try {
      screenshot = await makeNodeScreenshot(node, config);
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
    const globalBlock = globalBlocksAssembledSelector(store.getState())[
      globalBlockId
    ];

    if (!globalBlock) {
      return;
    }

    const { obj: popup } = findDeep(
      globalBlock,
      (obj) => obj && obj.value && obj.value._id === popupDbId
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

      const r = await apiCreateBlockScreenshot(
        {
          base64: screenshot.src,
          blockType: popupIsGlobal ? "global" : "normal"
        },
        config
      );

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
        const r = await apiCreateBlockScreenshot(
          {
            base64: screenshot.src,
            blockType: popupIsGlobal ? "global" : "normal"
          },
          config
        );

        screenshotId = r.id;
      } else {
        screenshotId = popup.value._thumbnailSrc;

        await apiUpdateBlockScreenshot(
          {
            id: screenshotId,
            base64: screenshot.src,
            blockType: popupIsGlobal ? "global" : "normal"
          },
          config
        );
      }
    }
  }

  // update store
  {
    const globalBlock = globalBlocksAssembledSelector(store.getState())[
      globalBlockId
    ];

    if (!globalBlock) {
      return;
    }

    const { obj: popup } = findDeep(
      globalBlock,
      (obj) => obj && obj.value && obj.value._id === popupDbId
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
