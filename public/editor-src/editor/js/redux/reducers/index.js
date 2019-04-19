import _ from "underscore";
import { combineReducers } from "redux";
import historyEnhancer from "./historyEnhancer";
import {
  HYDRATE,
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK,
  UPDATE_SAVED_BLOCK,
  DELETE_SAVED_BLOCK,
  UPDATE_UI,
  COPY_ELEMENT
} from "../actions";

// page

export function page(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      const { page } = action.payload;

      return page;
    case UPDATE_PAGE:
      const { data, status = state.status } = action.payload;

      return {
        ...state,
        data,
        status
      };
    default:
      return state;
  }
}

// globals

export function globals(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      const { globals } = action.payload;

      return globals;
    case UPDATE_GLOBALS:
      // temporary hack made for PublishButton
      if (!action.key) {
        return state;
      }

      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}

// global blocks

const globalBlocksDefault = {};
export function globalBlocks(state = globalBlocksDefault, action) {
  switch (action.type) {
    case HYDRATE:
      return action.payload.globalBlocks;
    case CREATE_GLOBAL_BLOCK:
    case UPDATE_GLOBAL_BLOCK: {
      const { id, data } = action.payload;

      return { ...state, [id]: data };
    }
    default:
      return state;
  }
}

// saved blocks

const savedBlocksDefault = {};
export function savedBlocks(state = savedBlocksDefault, action) {
  switch (action.type) {
    case HYDRATE:
      return action.payload.savedBlocks;
    case CREATE_SAVED_BLOCK:
    case UPDATE_SAVED_BLOCK: {
      const { id, data } = action.payload;

      return { ...state, [id]: data };
    }
    case DELETE_SAVED_BLOCK: {
      const { id } = action.payload;
      const { [id]: deleted, ...remaining } = state;

      return remaining;
    }
    default:
      return state;
  }
}

// ui

const uiDefault = {
  deviceMode: "desktop",
  leftSidebar: {
    isOpen: false,
    drawerContentType: null
  }
};
export function ui(state = uiDefault, action) {
  switch (action.type) {
    case UPDATE_UI:
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}

export function copiedElement(state = {}, action) {
  switch (action.type) {
    case COPY_ELEMENT:
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
}

export default historyEnhancer(
  combineReducers({
    page,
    globals,
    globalBlocks,
    savedBlocks,
    ui,
    copiedElement
  }),
  ["page", "globals", "globalBlocks"]
);
