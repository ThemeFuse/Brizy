import _ from "underscore";
import {
  updatePage as apiUpdatePage,
  saveGlobals as apiSaveGlobals
} from "visual/utils/api/editor";
import { UPDATE_PAGE, UPDATE_GLOBALS } from "../actionTypes";
import { ActionTypes as HistoryActionTypes } from "../reducers/historyEnhancer";

const { UNDO, REDO } = HistoryActionTypes;

const DEBOUNCE_WAIT = 2000;
const debouncedApiUpdatePage = _.debounce((pageId, pageData, cb) => {
  apiUpdatePage(pageId, pageData).then(r => cb(r));
}, DEBOUNCE_WAIT);
const debouncedApiSaveGlobals = _.debounce((globals, cb) => {
  apiSaveGlobals(globals).then(r => cb(r));
}, DEBOUNCE_WAIT);

export default store => next => action => {
  next(action);

  if (
    action.type === UPDATE_PAGE ||
    action.type === UNDO ||
    action.type === REDO
  ) {
    const { apiExtraData = {}, syncImmediate = false, syncSuccess = _.noop } =
      action.meta || {};
    const storePage = store.getState().page;
    const apiPageData = {
      ...storePage,
      data: JSON.stringify(storePage.data),
      ...apiExtraData
    };

    if (syncImmediate === true) {
      debouncedApiUpdatePage.cancel();
      apiUpdatePage(apiPageData.id, apiPageData).then(syncSuccess);
    } else {
      debouncedApiUpdatePage(apiPageData.id, apiPageData, syncSuccess);
    }
  }

  if (
    action.type === UPDATE_GLOBALS ||
    action.type === UNDO ||
    action.type === REDO
  ) {
    const { syncImmediate = false, syncSuccess = _.noop } = action.meta || {};

    if (syncImmediate === true) {
      debouncedApiSaveGlobals.cancel();
      apiSaveGlobals(store.getState().globals).then(syncSuccess);
    } else {
      debouncedApiSaveGlobals(store.getState().globals, syncSuccess);
    }
  }
};
