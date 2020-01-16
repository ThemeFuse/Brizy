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
  UPDATE_TRIGGERS
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
  apiUpdateRules
} from "./utils";
import {
  projectSelector,
  projectAssembled,
  fontSelector,
  stylesSelector,
  pageSelector,
  pageBlocksSelector,
  globalBlocksSelector,
  globalBlocksAssembled3Selector,
  globalBlocksInPageSelector,
  savedBlocksAssembledSelector
} from "../../selectors";

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

const { UNDO, REDO } = HistoryActionTypes;

export default store => next => action => {
  const oldState = store.getState();

  next(action);

  const state = store.getState();

  handlePublish({ action, state, oldState });
  handleProject({ action, state, oldState });
  handlePage({ action, state, oldState });
  handleGlobalBlocks({ action, state, oldState });
  handleSavedBlocks({ action, state, oldState });
  handleScreenshots({ action, state, oldState });
  IS_GLOBAL_POPUP && handlePopupRules({ action, state, oldState });
};

function handlePublish({ action, state }) {
  if (action.type === PUBLISH) {
    const { onSuccess = _.noop, onError = _.noop } = action.meta;

    const project = projectSelector(state);
    const page = pageSelector(state);
    const globalBlocksEntries = Object.entries(
      globalBlocksInPageSelector(state)
    );

    // cancel possible pending requests
    debouncedApiUpdatePage.cancel();
    debouncedApiUpdateProject.cancel();
    for (const [id] of globalBlocksEntries) {
      debouncedApiUpdateGlobalBlock(id).cancel();
    }

    // update
    const meta = { is_autosave: 0 };
    Promise.all([
      apiUpdateProject(project, meta),
      apiUpdatePage(page, meta),
      Promise.all(
        globalBlocksEntries.map(([id, data]) =>
          apiUpdateGlobalBlock({ id, data }, meta)
        )
      )
    ])
      .then(onSuccess)
      .catch(onError);
  }
}

function handleProject({ action, state, oldState }) {
  switch (action.type) {
    case UPDATE_DISABLED_ELEMENTS: {
      const meta = {
        is_autosave: 0
      };
      const project = projectSelector(state);

      apiUpdateProject(project, meta);
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

      apiUpdateProject(project, meta)
        .then(onSuccess)
        .catch(onError);
      break;
    }
    case UPDATE_TRIGGERS: {
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const meta = {
        is_autosave: 0
      };
      const project = projectSelector(state);

      apiUpdateProject(project, meta)
        .then(syncSuccess)
        .catch(syncFail);
      break;
    }
    case ADD_BLOCK:
    case ADD_FONTS:
    case DELETE_FONTS: {
      const fonts = fontSelector(state);

      if (fonts === fontSelector(oldState)) {
        return;
      }

      const { onSuccess = _.noop, onError = _.noop } = action.meta || {};
      const project = produce(projectSelector(state), draft => {
        draft.data.fonts = fonts;
      });
      const meta = {
        is_autosave: 0
      };

      // cancel pending request
      debouncedApiUpdateProject.cancel();

      apiUpdateProject(project, meta)
        .then(onSuccess)
        .catch(onError);
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

    debouncedApiCreateGlobalBlock(id)(action.payload);
  } else if (action.type === UPDATE_GLOBAL_BLOCK) {
    const { id } = action.payload;

    debouncedApiUpdateGlobalBlock(id)(action.payload, action.meta);
  } else if (action.type === DELETE_GLOBAL_BLOCK) {
    const { id } = action.payload;
    const globalBlock = globalBlocksSelector(state)[id];
    const payload = {
      id,
      data: globalBlock
    };
    const meta = {
      is_autosave: 0
    };

    debouncedApiUpdateGlobalBlock(id)(payload, meta);
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
          debouncedApiUpdateGlobalBlock(id)({ id, data: nextGlobalBlocks[id] });
        }
      });
    }
  }
}

function handleSavedBlocks({ action }) {
  if (action.type === CREATE_SAVED_BLOCK) {
    const { id } = action.payload;

    debouncedApiCreateSavedBlock(id)(action.payload);
  } else if (action.type === UPDATE_SAVED_BLOCK) {
    const { id } = action.payload;

    debouncedApiDUpdateSavedBlock(id)(action.payload, action.meta);
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
      const savedBlocks = savedBlocksAssembledSelector(state);
      const savedBlockToUpdate = savedBlocks[blockId];

      if (savedBlockToUpdate) {
        const data = {
          id: blockId,
          data: savedBlockToUpdate
        };
        const meta = { is_autosave: 0 };

        debouncedApiDUpdateSavedBlock(blockId)(data, meta);
      }
    }

    if (blockType === "global" && metaAction === "create") {
      const globalBlocks = globalBlocksAssembled3Selector(state);
      const globalBlockToUpdate = globalBlocks[blockId];

      if (globalBlockToUpdate) {
        const data = {
          id: blockId,
          data: globalBlockToUpdate
        };
        const meta = { is_autosave: 0 };

        debouncedApiUpdateGlobalBlock(blockId)(data, meta);
      }
    }
  }
}

function handlePopupRules({ action, state }) {
  if (action.type === UPDATE_RULES) {
    const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
    apiUpdateRules(action.payload, action.meta)
      .then(syncSuccess)
      .catch(syncFail);
  }
  if (action.type === UPDATE_RULES || action.type === UPDATE_TRIGGERS) {
    const { page } = state;
    const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
    const meta = {
      is_autosave: 0
    };

    apiUpdatePage(page, meta)
      .then(syncSuccess)
      .catch(syncFail);
  }
}
