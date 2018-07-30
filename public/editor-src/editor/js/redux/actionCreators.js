import _ from "underscore";
import {
  HYDRATE,
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  UPDATE_UI,
  SET_AJAX
} from "./actionTypes";
import { page as pageReducer, globals as globalsReducer } from "./reducers";

export function hydrate({ page, globals, styles }) {
  try {
    page.data = JSON.parse(page.data) || {};
  } catch (e) {
    page.data = {};
  }

  return {
    type: HYDRATE,
    page,
    globals,
    styles
  };
}

// pages
export function updatePage(data, meta) {
  return {
    type: UPDATE_PAGE,
    data,
    meta
  };
}

// globals

export function updateGlobals(key, value, meta, projectOrLanguage = "project") {
  if (projectOrLanguage !== "project" && projectOrLanguage !== "language") {
    throw new Error(
      "updateGlobals actionCreator must have the third argument set to either `project` or `language`"
    );
  }

  return {
    type: UPDATE_GLOBALS,
    key,
    value,
    meta,
    projectOrLanguage
  };
}

// ui

export function updateUI(key, value) {
  return {
    type: UPDATE_UI,
    key,
    value
  };
}

export function setDeviceMode(mode) {
  return updateUI("deviceMode", mode);
}

// ajax

export function setIsSaving(value) {
  return {
    type: SET_AJAX,
    value
  };
}
