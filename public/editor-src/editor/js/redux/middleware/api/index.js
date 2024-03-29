import produce from "immer";
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
import { isStory } from "visual/utils/models";
import {
  ADD_BLOCK,
  HYDRATE,
  MAKE_BLOCK_TO_GLOBAL_BLOCK,
  MAKE_GLOBAL_BLOCK_TO_BLOCK,
  REMOVE_BLOCK,
  REORDER_BLOCKS,
  UPDATE_BLOCKS,
  UPDATE_ERROR,
  UPDATE_POPUP_RULES,
  UPDATE_TRIGGERS,
  updateError
} from "../../actions";
import {
  ADD_FONTS,
  ADD_GLOBAL_BLOCK,
  ActionTypes,
  DELETE_FONTS,
  PUBLISH,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_DEFAULT_FONT,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_EXTRA_FONT_STYLES,
  updateStoreWasChanged
} from "../../actions2";
import { historySelector } from "../../history/selectors";
import { REDO, UNDO } from "../../history/types";
import {
  changedGBIdsSelector,
  defaultFontSelector,
  errorSelector,
  fontsSelector,
  globalBlocksAssembledSelector,
  pageBlocksRawSelector,
  pageSelector,
  projectAssembled,
  projectSelector,
  stylesSelector
} from "../../selectors";
import { handleGlobalBlocks } from "./globalBlocks";
import {
  apiOnChange,
  apiPublish,
  apiUpdateGlobalBlocks,
  apiUpdatePopupRules,
  debouncedApiAutoSave,
  debouncedApiPublish,
  debouncedApiUpdateGlobalBlock,
  onUpdate,
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
    handleGlobalBlocks({ action, state, apiHandler });
    handleHeartBeat({ action, state, apiHandler });
  };
};

function handlePublish({ action, state, oldState, apiHandler }) {
  if (action.type === PUBLISH) {
    const config = Config.getAll();
    const { onSuccess = _.noop, onError = _.noop } = action.meta ?? {};

    // update
    const meta = { is_autosave: 0 };

    const oldProject = projectSelector(oldState);
    const project = projectSelector(state);

    const oldPage = pageSelector(oldState);
    const page = pageSelector(state);

    const allApi = [];

    if (!isStory(config)) {
      const changedGBIds = changedGBIdsSelector(state);
      const globalBlocks = globalBlocksAssembledSelector(state);

      // cancel possible pending requests
      debouncedApiAutoSave.cancel();
      debouncedApiPublish.cancel();
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

      allApi.push(apiUpdateGlobalBlocks(newGlobalBlocks, meta));
    }

    let data = undefined;

    if (project !== oldProject) {
      data = {
        projectData: project
      };
    }

    if (page !== oldPage) {
      data = data || {};
      data.pageData = page;
    }

    if (data) {
      switch (action.payload.type) {
        case "internal": {
          const publish = {
            config,
            data,
            requiredCompilerData: { page, project }
          };
          allApi.push(apiPublish(publish));
          break;
        }
        case "external": {
          allApi.push(
            onUpdate({
              page,
              project,
              config,
              onDone: action.payload.res
            })
          );
          break;
        }
      }
    }

    apiHandler(Promise.all(allApi), onSuccess, onError);
  }
}

function handleProject({ action, state, oldState, apiHandler }) {
  const config = Config.getAll();

  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_STYLE_ID:
    case ActionTypes.UPDATE_CURRENT_STYLE:
    case UPDATE_EXTRA_FONT_STYLES: {
      const project = projectAssembled(state);

      debouncedApiAutoSave({ projectData: project }, config);
      break;
    }

    case ActionTypes.IMPORT_KIT:
    case UPDATE_CURRENT_KIT_ID:
    case UPDATE_DISABLED_ELEMENTS: {
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = projectSelector(state);

      // cancel pending request
      debouncedApiAutoSave.cancel();

      apiHandler(
        apiOnChange({ projectData: project }, config),
        onSuccess,
        onError
      );
      break;
    }

    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const oldFonts = fontsSelector(oldState);
      const fonts = fontsSelector(state);
      const oldStyles = stylesSelector(oldState);
      const styles = stylesSelector(state);

      if (oldFonts !== fonts || oldStyles !== styles) {
        const project = produce(projectSelector(state), (draft) => {
          draft.data.fonts = fonts;
          draft.data.styles = styles;
        });

        // cancel pending request
        debouncedApiAutoSave.cancel();

        apiHandler(
          apiOnChange({ projectData: project }, config),
          onSuccess,
          onError
        );
      }
      break;
    }

    case ADD_FONTS:
    case DELETE_FONTS: {
      const fonts = fontsSelector(state);
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.fonts = fonts;
      });

      // cancel pending request
      debouncedApiAutoSave.cancel();

      apiHandler(
        onChange({ projectData: project }, config),
        onSuccess,
        onError
      );
      break;
    }
    case UPDATE_DEFAULT_FONT: {
      const font = defaultFontSelector(state);
      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), (draft) => {
        draft.data.font = font;
      });

      // cancel pending request
      debouncedApiAutoSave.cancel();

      apiHandler(
        apiOnChange({ projectData: project }, config),
        onSuccess,
        onError
      );
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

        debouncedApiAutoSave({ projectData: project }, config);
      }
    }
  }
}

function handlePage({ action, state }) {
  switch (action.type) {
    case MAKE_BLOCK_TO_GLOBAL_BLOCK:
    case MAKE_GLOBAL_BLOCK_TO_BLOCK:
    case REORDER_BLOCKS:
    case UPDATE_BLOCKS:
    case ADD_BLOCK:
    case ADD_GLOBAL_BLOCK:
    case REMOVE_BLOCK: {
      const page = produce(pageSelector(state), (draft) => {
        draft.data.items = pageBlocksRawSelector(state);
      });

      debouncedApiAutoSave({ pageData: page }, Config.getAll());
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

      apiOnChange({ pageData: page }, Config.getAll())
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

const startHeartBeat = (apiHandler) => {
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
    .then((r) => {
      next(updateStoreWasChanged(StoreChanged.unchanged));
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
