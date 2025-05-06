import { noop, once } from "es-toolkit";
import { produce } from "immer";
import { onChange } from "visual/utils/api";
import { ErrorCodes } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import {
  ADD_BLOCK,
  HYDRATE,
  MAKE_BLOCK_TO_GLOBAL_BLOCK,
  MAKE_GLOBAL_BLOCK_TO_BLOCK,
  REORDER_BLOCKS,
  UPDATE_BLOCKS,
  UPDATE_POPUP_RULES,
  UPDATE_TRIGGERS
} from "../../actions";
import {
  ADD_FONTS,
  ADD_GLOBAL_BLOCK,
  ADD_GLOBAL_POPUP,
  ActionTypes,
  DELETE_FONTS,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_DEFAULT_FONT,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_EXTRA_FONT_STYLES,
  updateError
} from "../../actions2";
import { historySelector } from "../../history/selectors";
import { REDO, UNDO } from "../../history/types";
import {
  defaultFontSelector,
  errorSelector,
  filteredFontsSelector,
  fontsSelector,
  pageBlocksRawSelector,
  pageSelector,
  projectAssembled,
  projectSelector,
  stylesSelector
} from "../../selectors";
import { handleGlobalBlocks } from "./globalBlocks";
import { handlePublish } from "./publish";
import {
  apiOnChange,
  apiUpdatePopupRules,
  debouncedApiAutoSave,
  pollingSendHeartBeat
} from "./utils";

export default ({ getConfig, editorMode }) =>
  (store) =>
  (next) => {
    const apiHandler = apiCatch.bind(null, store.dispatch);

    return (action) => {
      const oldState = store.getState();

      next(action);

      const state = store.getState();

      const data = {
        action,
        store,
        state,
        oldState,
        getConfig,
        apiHandler,
        editorMode
      };
      handlePublish(data);
      handleProject(data);
      handlePage(data);
      handleGlobalBlocks(data);
      handleHeartBeat({ action, state, getConfig, apiHandler });
    };
  };

function handleProject({
  action,
  state,
  store,
  oldState,
  getConfig,
  apiHandler
}) {
  const config = getConfig();
  const apiAutoSave = debouncedApiAutoSave(config.autoSaveInterval);

  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_STYLE_ID:
    case ActionTypes.UPDATE_CURRENT_STYLE:
    case ActionTypes.ADD_NEW_GLOBAL_STYLE:
    case ActionTypes.REMOVE_GLOBAL_STYLE:
    case ActionTypes.EDIT_GLOBAL_STYLE_NAME:
    case UPDATE_EXTRA_FONT_STYLES: {
      const project = projectAssembled(state);

      apiAutoSave({ projectData: project }, config);
      break;
    }

    case ActionTypes.IMPORT_KIT:
    case UPDATE_CURRENT_KIT_ID:
    case UPDATE_DISABLED_ELEMENTS:
    case ActionTypes.UPDATE_PINNED_ELEMENTS: {
      const { onSuccess = noop, onError = noop } = action.meta || {};
      const project = projectSelector(state);
      const page = pageSelector(state);
      const data = {
        config,
        store,
        needToCompile: {
          project
        },
        state: {
          project,
          page,
          globalBlocks: []
        }
      };

      // cancel pending request
      apiAutoSave.cancel();

      apiHandler(apiOnChange(data), action, onSuccess, onError);
      break;
    }

    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { onSuccess = noop, onError = noop } = action.meta || {};
      const oldFonts = fontsSelector(oldState);
      const fonts = fontsSelector(state);
      const oldStyles = stylesSelector(oldState);
      const styles = stylesSelector(state);
      const page = pageSelector(state);

      if (oldFonts !== fonts || oldStyles !== styles) {
        const project = produce(projectSelector(state), (draft) => {
          draft.data.fonts = fonts;
          draft.data.styles = styles;
        });
        const data = {
          store,
          config,
          needToCompile: {
            project
          },
          state: {
            project,
            page,
            globalBlocks: []
          }
        };

        // cancel pending request
        apiAutoSave.cancel();

        apiHandler(apiOnChange(data), action, onSuccess, onError);
      }
      break;
    }

    case ADD_FONTS:
    case DELETE_FONTS: {
      const fonts = filteredFontsSelector(state);
      const { onSuccess = noop, onError = noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.fonts = fonts;
      });
      const page = pageSelector(state);
      const data = {
        config,
        store,
        needToCompile: {
          project
        },
        state: {
          project,
          page,
          globalBlocks: []
        }
      };

      // cancel pending request
      apiAutoSave.cancel();

      apiHandler(onChange(data), action, onSuccess, onError);
      break;
    }
    case UPDATE_DEFAULT_FONT: {
      const font = defaultFontSelector(state);
      const { onSuccess = noop, onError = noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.font = font;
      });
      const page = pageSelector(state);
      const data = {
        config,
        store,
        needToCompile: {
          project
        },
        state: {
          project,
          page,
          globalBlocks: []
        }
      };

      // cancel pending request
      apiAutoSave.cancel();

      apiHandler(apiOnChange(data), action, onSuccess, onError);
      break;
    }

    case UNDO:
    case REDO: {
      const { currSnapshot, prevSnapshot } = historySelector(state);
      const currStyleId = currSnapshot?.currentStyleId;
      const prevStyleId = prevSnapshot?.currentStyleId;
      const currStyle = currSnapshot?.currentStyle;
      const prevStyle = prevSnapshot?.currentStyle;
      const currExtraFontStyle = currSnapshot?.extraFontStyles;
      const prevExtraFontStyle = prevSnapshot?.extraFontStyles;

      if (
        currStyleId !== prevStyleId ||
        currStyle !== prevStyle ||
        currExtraFontStyle !== prevExtraFontStyle
      ) {
        const project = projectAssembled(state);

        apiAutoSave({ projectData: project }, config);
      }
    }
  }
}

function handlePage({ action, store, state, getConfig }) {
  const config = getConfig();

  const apiAutoSave = debouncedApiAutoSave(config.autoSaveInterval);
  switch (action.type) {
    case MAKE_BLOCK_TO_GLOBAL_BLOCK:
    case MAKE_GLOBAL_BLOCK_TO_BLOCK:
    case REORDER_BLOCKS:
    case UPDATE_BLOCKS:
    case ADD_BLOCK:
    case ADD_GLOBAL_BLOCK:
    case ADD_GLOBAL_POPUP:
    case ActionTypes.REMOVE_BLOCK: {
      const page = produce(pageSelector(state), (draft) => {
        draft.data.items = pageBlocksRawSelector(state);
      });

      apiAutoSave({ pageData: page }, config);
      break;
    }
    case UPDATE_POPUP_RULES: {
      const { syncSuccess = noop, syncFail = noop } = action.meta || {};
      const data = {
        rules: action.payload.rules,
        dataVersion: state.page.dataVersion
      };

      apiUpdatePopupRules(data, config).then(syncSuccess).catch(syncFail);
      break;
    }
    case UPDATE_TRIGGERS: {
      const { page } = state;
      const { syncSuccess = noop, syncFail = noop } = action.meta || {};
      const project = projectSelector(state);
      const data = {
        store,
        config,
        needToCompile: {
          page
        },
        state: {
          project,
          page,
          globalBlocks: []
        }
      };

      apiOnChange(data).then(syncSuccess).catch(syncFail);
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

const startHeartBeat = (apiHandler, config) => {
  const { heartBeatInterval } = config.project;

  apiHandler(pollingSendHeartBeat(heartBeatInterval, config));
};

const startHeartBeatOnce = once(startHeartBeat);

function handleHeartBeat({ action, state, getConfig, apiHandler }) {
  const config = getConfig();
  const { sendHandler } = config.api.heartBeat ?? {};

  if (action.type === ActionTypes.UPDATE_ERROR || action.type === HYDRATE) {
    const error = errorSelector(state);
    const projectUnLocked =
      !error || error.code !== ErrorCodes.PROJECT_LOCKED_ERROR;

    if (projectUnLocked && typeof sendHandler === "function") {
      startHeartBeatOnce(apiHandler, config);
    }
  }
}

function apiCatch(next, p, action, onSuccess = noop, onError = noop) {
  return p
    .then((r) => {
      onSuccess(r);
    })
    .catch((r) => {
      if (r && r.heartBeat) {
        next(
          updateError({
            code: ErrorCodes.HEART_BEAT_ERROR,
            data: r.data
          })
        );
      } else {
        next(
          updateError({
            code: ErrorCodes.PROJECT_DATA_VERSION_ERROR,
            data: t(
              "This page needs a refresh. You’ve probably updated this page (or another page) in a different tab or browser."
            )
          })
        );

        onError(r);
      }
    });
}
