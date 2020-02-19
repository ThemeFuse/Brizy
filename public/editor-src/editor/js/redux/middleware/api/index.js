import _ from "underscore";
import produce from "immer";
import Config from "visual/global/Config";
import {
  UPDATE_PAGE,
  UPDATE_BLOCKS,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  DELETE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK,
  UPDATE_SAVED_BLOCK,
  DELETE_SAVED_BLOCK,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  UPDATE_EXTRA_FONT_STYLES,
  PUBLISH,
  IMPORT_TEMPLATE,
  IMPORT_KIT,
  ADD_BLOCK,
  REMOVE_BLOCK,
  ADD_FONTS,
  DELETE_FONTS,
  UPDATE_SCREENSHOT,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_RULES,
  UPDATE_TRIGGERS,
  updateError,
  UPDATE_ERROR,
  HYDRATE
} from "../../actions";
import { ActionTypes as HistoryActionTypes } from "../../reducers/historyEnhancer";
import {
  apiUpdateProject,
  debouncedApiUpdateProject,
  apiUpdatePage,
  debouncedApiUpdatePage,
  debouncedApiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  debouncedApiUpdateGlobalBlock,
  debouncedApiCreateSavedBlock,
  debouncedApiDUpdateSavedBlock,
  debouncedApiDeleteSavedBlock,
  apiUpdateRules,
  pollingSendHeartBeat
} from "./utils";
import {
  projectSelector,
  projectAssembled,
  fontSelector,
  stylesSelector,
  pageSelector,
  pageBlocksSelector,
  globalBlocksSelector,
  globalBlocksInPageSelector,
  savedBlocksSelector,
  errorSelector
} from "../../selectors";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR
} from "visual/utils/errors";

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

const { UNDO, REDO } = HistoryActionTypes;

export default store => next => {
  const apiHandler = apiCatch.bind(null, next);

  return action => {
    next(action);

    const state = store.getState();

    handlePublish({ action, state, apiHandler });
    handleProject({ action, state, apiHandler });
    handlePage({ action, state, apiHandler });
    handleGlobalBlocks({ action, state, apiHandler });
    handleSavedBlocks({ action, state, apiHandler });
    handleScreenshots({ action, state, apiHandler });
    handleHeartBeat({ action, state, apiHandler });

    IS_GLOBAL_POPUP && handlePopupRules({ action, state, apiHandler });
  };
};

function handlePublish({ action, state, apiHandler }) {
  if (action.type === PUBLISH) {
    const { onSuccess = _.noop, onError = _.noop } = action.meta;

    const project = projectSelector(state);
    const page = pageSelector(state);
    const globalBlocksEntries = Object.values(
      globalBlocksInPageSelector(state)
    );

    // cancel possible pending requests
    debouncedApiUpdatePage.cancel();
    debouncedApiUpdateProject.cancel();
    for (const { id } of globalBlocksEntries) {
      debouncedApiUpdateGlobalBlock(id).cancel();
    }

    // update
    const meta = { is_autosave: 0 };

    apiHandler(
      Promise.all([
        apiUpdateProject(project, meta),
        apiUpdatePage(page, meta),
        ...globalBlocksEntries.map(block => apiUpdateGlobalBlock(block, meta))
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
      const currentStyleId = action.currentSnapshot.currentStyleId;
      const nextStyleId = action.nextSnapshot.currentStyleId;
      const currentStyle = action.currentSnapshot.currentStyle;
      const nextStyle = action.nextSnapshot.currentStyle;
      const currentExtraFontStyle = action.currentSnapshot.extraFontStyles;
      const nextExtraFontStyle = action.nextSnapshot.extraFontStyles;

      if (
        currentStyleId !== nextStyleId ||
        currentStyle !== nextStyle ||
        currentExtraFontStyle !== nextExtraFontStyle
      ) {
        const project = projectAssembled(state);

        debouncedApiUpdateProject(project);
      }
    }
  }
}

function handlePage({ action, state }) {
  switch (action.type) {
    case UPDATE_PAGE:
    case ADD_BLOCK:
    case REMOVE_BLOCK: {
      const { page } = state;

      debouncedApiUpdatePage(page, action.meta);
      break;
    }
    case UPDATE_BLOCKS: {
      const page = produce(pageSelector(state), draft => {
        draft.data.items = pageBlocksSelector(state);
      });

      debouncedApiUpdatePage(page, action.meta);
      break;
    }
    case UPDATE_RULES: {
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const page = { ...state.page, rules: action.payload };
      apiUpdateRules(page, action.meta)
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
      const { page: currentPage } = action.currentSnapshot;
      const { page: nextPage } = action.nextSnapshot;

      if (currentPage !== nextPage) {
        debouncedApiUpdatePage(nextPage);
      }
    }
  }
}

function handleGlobalBlocks({ action, state }) {
  if (action.type === CREATE_GLOBAL_BLOCK) {
    const { id } = action.payload;
    const globalBlock = globalBlocksSelector(state)[id];

    debouncedApiCreateGlobalBlock(id)(globalBlock);
  } else if (action.type === UPDATE_GLOBAL_BLOCK) {
    const { id } = action.payload;
    const globalBlock = globalBlocksSelector(state)[id];

    debouncedApiUpdateGlobalBlock(id)(globalBlock, action.meta);
  } else if (action.type === DELETE_GLOBAL_BLOCK) {
    const { id } = action.payload;
    const globalBlock = globalBlocksSelector(state)[id];
    const meta = {
      is_autosave: 0
    };

    debouncedApiUpdateGlobalBlock(id)(globalBlock, meta);
  } else if (action.type === UNDO || action.type === REDO) {
    const { globalBlocks: currentGlobalBlocks } = action.currentSnapshot;
    const { globalBlocks: nextGlobalBlocks } = action.nextSnapshot;

    if (currentGlobalBlocks !== nextGlobalBlocks) {
      Object.keys(nextGlobalBlocks).forEach(id => {
        if (
          nextGlobalBlocks[id] &&
          currentGlobalBlocks[id] &&
          nextGlobalBlocks[id] !== currentGlobalBlocks[id]
        ) {
          const globalBlock = nextGlobalBlocks[id];
          debouncedApiUpdateGlobalBlock(id)(globalBlock);
        }
      });
    }
  }
}

function handleSavedBlocks({ action, state }) {
  if (action.type === CREATE_SAVED_BLOCK) {
    const { id } = action.payload;
    const savedBlock = savedBlocksSelector(state)[id];

    debouncedApiCreateSavedBlock(id)(savedBlock);
  } else if (action.type === UPDATE_SAVED_BLOCK) {
    const { id } = action.payload;
    const savedBlock = savedBlocksSelector(state)[id];

    debouncedApiDUpdateSavedBlock(id)(savedBlock, action.meta);
  } else if (action.type === DELETE_SAVED_BLOCK) {
    const { id } = action.payload;

    debouncedApiDeleteSavedBlock(id)(action.payload);
  }
}

function handleScreenshots({ action, state }) {
  if (action.type === UPDATE_SCREENSHOT) {
    const {
      payload: { blockId },
      meta: { blockType, action: metaAction }
    } = action;

    if (blockType === "saved") {
      const savedBlock = savedBlocksSelector(state)[blockId];

      if (savedBlock) {
        const meta = { is_autosave: 0 };

        debouncedApiDUpdateSavedBlock(blockId)(savedBlock, meta);
      }
    }

    if (blockType === "global" && metaAction === "create") {
      const globalBlock = globalBlocksSelector(state)[blockId];

      if (globalBlock) {
        const meta = { is_autosave: 0 };

        debouncedApiUpdateGlobalBlock(blockId)(globalBlock, meta);
      }
    }
  }
}

function handlePopupRules({ action, state, apiHandler }) {
  if (action.type === UPDATE_RULES) {
    const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};

    apiHandler(
      apiUpdateRules(action.payload, action.meta),
      syncSuccess,
      syncFail
    );
  }
  if (action.type === UPDATE_RULES || action.type === UPDATE_TRIGGERS) {
    const { page } = state;
    const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
    const meta = {
      is_autosave: 0
    };

    apiHandler(apiUpdatePage(page, meta), syncSuccess, syncFail);
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
            data:
              "Something went wrong, maybe your data is old, please refresh your page and try again"
          })
        );

        onError(r);
      }
    });
}
