import _ from "underscore";
import produce from "immer";
import Config from "visual/global/Config";
import {
  MAKE_NORMAL_TO_GLOBAL_BLOCK,
  MAKE_GLOBAL_TO_NORMAL_BLOCK,
  REORDER_BLOCKS,
  UPDATE_BLOCKS,
  UPDATE_GLOBAL_BLOCK,
  DELETE_GLOBAL_BLOCK,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  IMPORT_TEMPLATE,
  IMPORT_KIT,
  ADD_BLOCK,
  ADD_GLOBAL_BLOCK,
  REMOVE_BLOCK,
  ADD_FONTS,
  DELETE_FONTS,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_POPUP_RULES,
  UPDATE_GB_RULES,
  UPDATE_TRIGGERS,
  updateError,
  UPDATE_ERROR,
  HYDRATE
} from "../../actions";
import {
  PUBLISH,
  IMPORT_STORY,
  UPDATE_EXTRA_FONT_STYLES
} from "../../actions2";
import {
  apiUpdateProject,
  debouncedApiUpdateProject,
  apiUpdatePage,
  debouncedApiUpdatePage,
  apiUpdateGlobalBlock,
  debouncedApiUpdateGlobalBlock,
  apiUpdateGlobalBlocks,
  debouncedApiUpdateGlobalBlocksPositions,
  apiUpdatePopupRules,
  pollingSendHeartBeat
} from "./utils";
import {
  pageSelector,
  fontSelector,
  projectSelector,
  projectAssembled,
  stylesSelector,
  pageBlocksRawSelector,
  globalBlocksSelector,
  globalBlocksAssembledSelector,
  changedGBIdsSelector,
  errorSelector
} from "../../selectors";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR
} from "visual/utils/errors";
import { IS_STORY } from "visual/utils/models";
import { UNDO, REDO } from "../../history/types";
import { historySelector } from "../../history/selectors";
import { t } from "visual/utils/i18n";

export default store => next => {
  const apiHandler = apiCatch.bind(null, next);

  return action => {
    next(action);

    const state = store.getState();

    handlePublish({ action, state, apiHandler });
    handleProject({ action, state, apiHandler });
    handlePage({ action, state, apiHandler });
    handleGlobalBlocks({ action, state, apiHandler });
    handleHeartBeat({ action, state, apiHandler });
  };
};

function handlePublish({ action, state, apiHandler }) {
  if (action.type === PUBLISH) {
    const { onSuccess = _.noop, onError = _.noop } = action.meta;

    // update
    const meta = { is_autosave: 0 };

    const project = projectSelector(state);
    const page = pageSelector(state);

    let gbPromise;
    if (IS_STORY) {
      gbPromise = Promise.resolve();
    } else {
      const changedGBIds = changedGBIdsSelector(state);
      const globalBlocks = globalBlocksAssembledSelector(state);

      // cancel possible pending requests
      debouncedApiUpdatePage.cancel();
      debouncedApiUpdateProject.cancel();
      debouncedApiUpdateGlobalBlocksPositions.cancel();

      const newGlobalBlocks = Object.entries(globalBlocks).reduce(
        (acc, [id, globalBlock]) => {
          debouncedApiUpdateGlobalBlock.cancel(id);

          // eslint-disable-next-line no-unused-vars
          const { data, ...rest } = globalBlock;

          acc[id] = !changedGBIds.includes(id) ? rest : globalBlock;

          return acc;
        },
        {}
      );

      gbPromise = apiUpdateGlobalBlocks(newGlobalBlocks, meta);
    }

    apiHandler(
      Promise.all([
        apiUpdateProject(project, meta),
        apiUpdatePage(page, meta),
        gbPromise
      ]),
      onSuccess,
      onError
    );
  }
}

function handleProject({ action, state, apiHandler }) {
  switch (action.type) {
    case UPDATE_DISABLED_ELEMENTS: {
      const meta = {
        is_autosave: 0
      };
      const project = projectSelector(state);

      apiHandler(apiUpdateProject(project, meta));
      break;
    }
    case UPDATE_CURRENT_STYLE_ID:
    case UPDATE_CURRENT_STYLE:
    case UPDATE_EXTRA_FONT_STYLES: {
      const project = projectAssembled(state);

      debouncedApiUpdateProject(project);
      break;
    }
    case IMPORT_STORY:
    case IMPORT_TEMPLATE:
    case IMPORT_KIT:
    case UPDATE_CURRENT_KIT_ID: {
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), draft => {
        draft.data.fonts = fontSelector(state);
        draft.data.styles = stylesSelector(state);
      });
      const meta = {
        is_autosave: 0
      };

      // cancel pending request
      debouncedApiUpdateProject.cancel();

      apiHandler(apiUpdateProject(project, meta), onSuccess, onError);
      break;
    }
    case ADD_FONTS:
    case DELETE_FONTS: {
      const fonts = fontSelector(state);
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), draft => {
        draft.data.fonts = fonts;
      });
      const meta = {
        is_autosave: 0
      };

      // cancel pending request
      debouncedApiUpdateProject.cancel();

      apiHandler(apiUpdateProject(project, meta), onSuccess, onError);
      break;
    }
    case UNDO:
    case REDO: {
      const { currSnapshot, prevSnapshot } = historySelector(state);
      const currStyleId = currSnapshot.currentStyleId;
      const prevStyleId = prevSnapshot.currentStyleId;
      const currStyle = currSnapshot.currentStyle;
      const prevStyle = prevSnapshot.currentStyle;
      const currExtraFontStyle = currSnapshot.extraFontStyles;
      const prevExtraFontStyle = prevSnapshot.extraFontStyles;

      if (
        currStyleId !== prevStyleId ||
        currStyle !== prevStyle ||
        currExtraFontStyle !== prevExtraFontStyle
      ) {
        const project = projectAssembled(state);

        debouncedApiUpdateProject(project);
      }
    }
  }
}

function handlePage({ action, state }) {
  switch (action.type) {
    case MAKE_NORMAL_TO_GLOBAL_BLOCK:
    case MAKE_GLOBAL_TO_NORMAL_BLOCK:
    case REORDER_BLOCKS:
    case UPDATE_BLOCKS:
    case ADD_BLOCK:
    case ADD_GLOBAL_BLOCK:
    case REMOVE_BLOCK: {
      const page = produce(pageSelector(state), draft => {
        draft.data.items = pageBlocksRawSelector(state);
      });

      debouncedApiUpdatePage(page, action.meta);
      break;
    }
    case UPDATE_POPUP_RULES: {
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const page = { ...state.page, rules: action.payload.rules };
      apiUpdatePopupRules(page, action.meta)
        .then(syncSuccess)
        .catch(syncFail);
      break;
    }
    case UPDATE_TRIGGERS: {
      const { page } = state;
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const meta = {
        is_autosave: 0
      };

      apiUpdatePage(page, meta)
        .then(syncSuccess)
        .catch(syncFail);
      break;
    }
    case UNDO:
    case REDO: {
      // This wasn't working for some time because
      // page wasn't part of the keys that were part of history
      // for some time now, and thus currentPage and nextPage were undefined
      // leaving this as it was for now
      // ==========
      // const currentSnapshot = action.currentSnapshot;
      // const nextSnapshot = action.nextSnapshot;
      // const currentState = { ...state, ...currentSnapshot };
      // const newState = { ...state, ...nextSnapshot };
      // const blocksOrderRawCurrent = blocksOrderRawSelector(currentState);
      // const blocksOrderRawNext = blocksOrderRawSelector(newState);
      // const differentOrder = blocksOrderRawCurrent !== blocksOrderRawNext;
      // const differentData = blocksOrderRawNext.some(
      //   id => currentSnapshot.blocksData[id] !== nextSnapshot.blocksData[id]
      // );
      // if (differentOrder || differentData) {
      //   const page = produce(pageSelector(newState), draft => {
      //     draft.data.items = pageBlocksRawSelector(newState);
      //   });
      //   debouncedApiUpdatePage(page);
      // }
    }
  }
}

function handleGlobalBlocks({ action, state }) {
  if (action.type === ADD_GLOBAL_BLOCK) {
    const { _id } = action.payload.block.value;

    const globalBlock = globalBlocksSelector(state)[_id];

    debouncedApiUpdateGlobalBlock.set(_id, _id, globalBlock, action.meta);
  } else if (
    action.type === UPDATE_GLOBAL_BLOCK ||
    action.type === REMOVE_BLOCK
  ) {
    const { id } = action.payload;
    const globalBlock = globalBlocksAssembledSelector(state)[id];

    if (globalBlock) {
      debouncedApiUpdateGlobalBlock.set(id, id, globalBlock, action.meta);
    }
  } else if (action.type === UPDATE_GB_RULES) {
    const { id } = action.payload;
    const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
    const meta = {
      is_autosave: 0
    };
    const globalBlock = globalBlocksSelector(state)[id];

    apiUpdateGlobalBlock(id, globalBlock, meta)
      .then(syncSuccess)
      .catch(syncFail);
  }
  if (action.type === MAKE_GLOBAL_TO_NORMAL_BLOCK) {
    const { fromBlockId } = action.payload;
    const globalBlock = globalBlocksAssembledSelector(state)[fromBlockId];

    debouncedApiUpdateGlobalBlock.set(
      fromBlockId,
      fromBlockId,
      globalBlock,
      action.meta
    );
  } else if (action.type === DELETE_GLOBAL_BLOCK) {
    const { id } = action.payload;
    const globalBlock = globalBlocksSelector(state)[id];
    const meta = {
      is_autosave: 0
    };

    debouncedApiUpdateGlobalBlock.set(id, id, globalBlock, meta);
  } else if (action.type === UNDO || action.type === REDO) {
    // const { blocksData: currentBlocksData } = action.currentSnapshot;
    // const { blocksData: nextBlocksData } = action.nextSnapshot;
    // const nextGlobalBlocks = globalBlocksAssembledSelector({
    //   ...state,
    //   ...action.nextSnapshot
    // });
    // Object.keys(nextGlobalBlocks).forEach(id => {
    //   if (currentBlocksData[id] !== nextBlocksData[id]) {
    //     const globalBlock = nextGlobalBlocks[id];
    //     debouncedApiUpdateGlobalBlock.set(id, id, globalBlock);
    //   }
    // });
  }
}

const startHeartBeat = apiHandler => {
  const { heartBeatInterval } = Config.get("project");
  apiHandler(pollingSendHeartBeat(heartBeatInterval));
};

const startHeartBeatOnce = _.once(startHeartBeat);

function handleHeartBeat({ action, state, apiHandler }) {
  if (action.type === UPDATE_ERROR || action.type === HYDRATE) {
    const error = errorSelector(state);
    const projectUnLocked = !error || error.code !== PROJECT_LOCKED_ERROR;

    if (projectUnLocked) {
      startHeartBeatOnce(apiHandler);
    }
  }
}

function apiCatch(next, p, onSuccess = _.noop, onError = _.noop) {
  return p
    .then(r => {
      onSuccess(r);
    })
    .catch(r => {
      if (r && r.heartBeat) {
        next(
          updateError({
            code: HEART_BEAT_ERROR,
            data: r.data
          })
        );
      } else {
        next(
          updateError({
            code: PROJECT_DATA_VERSION_ERROR,
            data: t(
              "This page needs a refresh. You’ve probably updated this page (or another page) in a different tab or browser."
            )
          })
        );

        onError(r);
      }
    });
}
