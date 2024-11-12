import { produce } from "immer";
import _ from "underscore";
import Config from "visual/global/Config";
import { StoreChanged } from "visual/redux/types";
import { onChange } from "visual/utils/api";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR
} from "visual/utils/errors";
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
  ActionTypes,
  ADD_FONTS,
  ADD_GLOBAL_BLOCK,
  ADD_GLOBAL_POPUP,
  DELETE_FONTS,
  PUBLISH,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_DEFAULT_FONT,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_EXTRA_FONT_STYLES,
  updateError,
  updateStoreWasChanged
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

export default (store) => (next) => {
  const apiHandler = apiCatch.bind(null, store.dispatch);

  return (action) => {
    const oldState = store.getState();

    next(action);

    const state = store.getState();

    handlePublish({ action, state, oldState, apiHandler });
    handleProject({ action, state, oldState, apiHandler });
    handlePage({ action, state, apiHandler });
    handleGlobalBlocks({ action, state, oldState, apiHandler });
    handleHeartBeat({ action, state, apiHandler });
  };
};

function handleProject({ action, state, oldState, apiHandler }) {
  const config = Config.getAll();
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
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = projectSelector(state);
      const page = pageSelector(state);
      const data = {
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
      break;
    }

    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
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
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.fonts = fonts;
      });
      const page = pageSelector(state);
      const data = {
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

      apiHandler(onChange(data), action, onSuccess, onError);
      break;
    }
    case UPDATE_DEFAULT_FONT: {
      const font = defaultFontSelector(state);
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.font = font;
      });
      const page = pageSelector(state);
      const data = {
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

function handlePage({ action, state }) {
  const config = Config.getAll();
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
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const data = {
        rules: action.payload.rules,
        dataVersion: state.page.dataVersion
      };

      apiUpdatePopupRules(data, Config.getAll())
        .then(syncSuccess)
        .catch(syncFail);
      break;
    }
    case UPDATE_TRIGGERS: {
      const { page } = state;
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const config = Config.getAll();
      const project = projectSelector(state);
      const data = {
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

const startHeartBeat = (apiHandler) => {
  const { heartBeatInterval } = Config.get("project");
  apiHandler(pollingSendHeartBeat(heartBeatInterval));
};

const startHeartBeatOnce = _.once(startHeartBeat);

function handleHeartBeat({ action, state, apiHandler }) {
  const config = Config.getAll();
  const { sendHandler } = config.api.heartBeat ?? {};

  if (action.type === ActionTypes.UPDATE_ERROR || action.type === HYDRATE) {
    const error = errorSelector(state);
    const projectUnLocked = !error || error.code !== PROJECT_LOCKED_ERROR;

    if (projectUnLocked && typeof sendHandler === "function") {
      startHeartBeatOnce(apiHandler);
    }
  }
}

function apiCatch(next, p, action, onSuccess = _.noop, onError = _.noop) {
  return p
    .then((r) => {
      if (action?.type === PUBLISH) {
        next(updateStoreWasChanged(StoreChanged.unchanged));
      }

      onSuccess(r);
    })
    .catch((r) => {
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
