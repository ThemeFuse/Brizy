export const HYDRATE = "HYDRATE";
export const EDITOR_RENDERED = "EDITOR_RENDERED";
export const UPDATE_BLOCKS = "UPDATE_BLOCKS";
export const REORDER_BLOCKS = "REORDER_BLOCKS";
export const MAKE_BLOCK_TO_GLOBAL_BLOCK = "MAKE_BLOCK_TO_GLOBAL_BLOCK";
export const MAKE_POPUP_TO_GLOBAL_POPUP = "MAKE_POPUP_TO_GLOBAL_POPUP";
export const MAKE_GLOBAL_POPUP_TO_POPUP = "MAKE_GLOBAL_POPUP_TO_POPUP";
export const UPDATE_GLOBAL_BLOCK = "UPDATE_GLOBAL_BLOCK";
export const DELETE_GLOBAL_BLOCK = "DELETE_GLOBAL_BLOCK";
export const UPDATE_POPUP_RULES = "UPDATE_POPUP_RULES";
export const UPDATE_UI = "UPDATE_UI";
export const UPDATE_GB_RULES = "UPDATE_GB_RULES";
export const UPDATE_TRIGGERS = "UPDATE_TRIGGERS";
export const MAKE_GLOBAL_BLOCK_TO_BLOCK = "MAKE_GLOBAL_BLOCK_TO_BLOCK";
export const ADD_BLOCK = "ADD_BLOCK";
export const UPDATE_AUTHORIZATION = "UPDATE_AUTHORIZATION";

export function hydrate({
  project,
  projectStatus,
  fonts,
  page,
  globalBlocks,
  authorized,
  syncAllowed,
  config,
  configId,
  editorMode
}) {
  return {
    type: HYDRATE,
    payload: {
      project,
      projectStatus,
      fonts,
      page,
      globalBlocks,
      authorized,
      syncAllowed,
      config,
      configId,
      editorMode
    }
  };
}

export function editorRendered() {
  return {
    type: EDITOR_RENDERED
  };
}

// project

export function updatePopupRules({ data, meta }) {
  return {
    type: UPDATE_POPUP_RULES,
    payload: data,
    meta
  };
}

// update triggers

export function updateTriggers(data, meta) {
  return {
    type: UPDATE_TRIGGERS,
    payload: {
      data
    },
    meta
  };
}
