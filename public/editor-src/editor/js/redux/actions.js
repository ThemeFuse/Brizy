import _ from "underscore";

export const HYDRATE = "HYDRATE";
export const EDITOR_RENDERED = "EDITOR_RENDERED";
export const UPDATE_PAGE = "UPDATE_PAGE";
export const UPDATE_GLOBALS = "UPDATE_GLOBALS";
export const CREATE_GLOBAL_BLOCK = "CREATE_GLOBAL_BLOCK";
export const UPDATE_GLOBAL_BLOCK = "UPDATE_GLOBAL_BLOCK";
export const CREATE_SAVED_BLOCK = "CREATE_SAVED_BLOCK";
export const UPDATE_SAVED_BLOCK = "UPDATE_SAVED_BLOCK";
export const DELETE_SAVED_BLOCK = "DELETE_SAVED_BLOCK";
export const UPDATE_UI = "UPDATE_UI";
export const COPY_ELEMENT = "COPY_ELEMENT";

export function hydrate({ page, globals, globalBlocks, savedBlocks }) {
  return {
    type: HYDRATE,
    payload: {
      page,
      globals,
      globalBlocks,
      savedBlocks
    }
  };
}

export function editorRendered() {
  return {
    type: EDITOR_RENDERED
  };
}

// pages

export function updatePage({ data, status, meta }) {
  return {
    type: UPDATE_PAGE,
    payload: {
      data,
      ...(status ? { status } : {})
    },
    meta: {
      is_autosave: 1,
      ...meta
    }
  };
}

// globals

export function updateGlobals({ key, value, meta }) {
  return {
    type: UPDATE_GLOBALS,
    key,
    value,
    meta: {
      is_autosave: 1,
      ...meta
    }
  };
}

// globalBlocks

export function createGlobalBlock({ id, data, meta }) {
  return {
    type: CREATE_GLOBAL_BLOCK,
    payload: {
      id,
      data
    },
    meta
  };
}

export function updateGlobalBlock({ id, data, meta }) {
  return {
    type: UPDATE_GLOBAL_BLOCK,
    payload: {
      id,
      data
    },
    meta: {
      is_autosave: 1,
      ...meta
    }
  };
}

// saved blocks

export function createSavedBlock({ id, data, meta }) {
  return {
    type: CREATE_SAVED_BLOCK,
    payload: {
      id,
      data
    },
    meta
  };
}

export function updateSavedBlock({ id, data, meta }) {
  return {
    type: UPDATE_SAVED_BLOCK,
    payload: {
      id,
      data
    },
    meta: {
      is_autosave: 0,
      ...meta
    }
  };
}

export function deleteSavedBlock({ id, meta }) {
  return {
    type: DELETE_SAVED_BLOCK,
    payload: {
      id
    },
    meta
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

// copy

export function updateCopiedElement(value) {
  return {
    type: COPY_ELEMENT,
    value
  };
}
