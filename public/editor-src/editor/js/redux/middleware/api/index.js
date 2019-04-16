import _ from "underscore";
import {
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK,
  UPDATE_SAVED_BLOCK,
  DELETE_SAVED_BLOCK
} from "../../actions";
import { ActionTypes as HistoryActionTypes } from "../../reducers/historyEnhancer";
import {
  apiUpdatePage,
  debouncedApiUpdatePage,
  apiUpdateGlobals,
  debouncedApiUpdateGlobals,
  apiCreateGlobalBlock,
  debouncedApiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  debouncedApiUpdateGlobalBlock,
  apiCreateSavedBlock,
  debouncedApiCreateSavedBlock,
  apiUpdateSavedBlock,
  debouncedApiDUpdateSavedBlock,
  apiDeleteSavedBlock,
  debouncedApiDeleteSavedBlock
} from "./utils";

const { UNDO, REDO } = HistoryActionTypes;

export default store => next => action => {
  next(action);

  handlePage(action, store);
  handleGlobals(action, store);
  handleGlobalBlocks(action, store);
  handleSavedBlocks(action, store);
};

function handlePage(action, store) {
  if (action.type === UPDATE_PAGE) {
    const { page } = store.getState();
    const { syncImmediate = false, syncSuccess = _.noop, syncFail = _.noop } =
      action.meta || {};

    if (syncImmediate === true) {
      debouncedApiUpdatePage.cancel();
      apiUpdatePage(page, action.meta)
        .then(syncSuccess)
        .catch(syncFail);
    } else {
      debouncedApiUpdatePage(page, action.meta);
    }
  } else if (action.type === UNDO || action.type === REDO) {
    const { page: currentPage } = action.currentSnapshot;
    const { page: nextPage } = action.nextSnapshot;

    if (currentPage !== nextPage) {
      debouncedApiUpdatePage(nextPage);
    }
  }
}

function handleGlobals(action, store) {
  if (action.type === UPDATE_GLOBALS) {
    const { globals } = store.getState();
    const { syncImmediate = false, syncSuccess = _.noop, syncFail = _.noop } =
      action.meta || {};

    if (syncImmediate === true) {
      debouncedApiUpdateGlobals.cancel();
      apiUpdateGlobals(globals, action.meta)
        .then(syncSuccess)
        .catch(syncFail);
    } else {
      debouncedApiUpdateGlobals(globals, action.meta);
    }
  } else if (action.type === UNDO || action.type === REDO) {
    const { globals: currentGlobals } = action.currentSnapshot;
    const { globals: nextGlobals } = action.nextSnapshot;

    if (currentGlobals !== nextGlobals) {
      debouncedApiUpdateGlobals(nextGlobals);
    }
  }
}

function handleGlobalBlocks(action) {
  if (action.type === CREATE_GLOBAL_BLOCK) {
    const { id } = action.payload;

    debouncedApiCreateGlobalBlock(id)(action.payload);
  } else if (action.type === UPDATE_GLOBAL_BLOCK) {
    const { syncImmediate = false, syncSuccess = _.noop, syncFail = _.noop } =
      action.meta || {};
    const { id } = action.payload;

    if (syncImmediate === true) {
      debouncedApiUpdateGlobalBlock(id).cancel();
      apiUpdateGlobalBlock(action.payload, action.meta)
        .then(syncSuccess)
        .catch(syncFail);
    } else {
      debouncedApiUpdateGlobalBlock(id)(action.payload, action.meta);
    }
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

function handleSavedBlocks(action) {
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
