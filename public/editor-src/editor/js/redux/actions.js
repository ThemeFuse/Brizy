import { mergeDeep } from "timm";
import { fontSelector } from "./selectors";
import { updateUI } from "./actions2";

export const HYDRATE = "HYDRATE";
export const EDITOR_RENDERED = "EDITOR_RENDERED";
export const UPDATE_PAGE = "UPDATE_PAGE";
export const UPDATE_BLOCKS = "UPDATE_BLOCKS";
export const ADD_BLOCK = "ADD_BLOCK";
export const REMOVE_BLOCK = "REMOVE_BLOCK";
export const REORDER_BLOCKS = "REORDER_BLOCKS";
export const CREATE_GLOBAL_BLOCK = "CREATE_GLOBAL_BLOCK";
export const UPDATE_GLOBAL_BLOCK = "UPDATE_GLOBAL_BLOCK";
export const DELETE_GLOBAL_BLOCK = "DELETE_GLOBAL_BLOCK";
export const CREATE_SAVED_BLOCK = "CREATE_SAVED_BLOCK";
export const UPDATE_SAVED_BLOCK = "UPDATE_SAVED_BLOCK";
export const DELETE_SAVED_BLOCK = "DELETE_SAVED_BLOCK";
export const CREATE_RULES = "CREATE_RULES";
export const UPDATE_RULES = "UPDATE_RULES";
export const UPDATE_UI = "UPDATE_UI";
export const COPY_ELEMENT = "COPY_ELEMENT";
export const IMPORT_TEMPLATE = "IMPORT_TEMPLATE";
export const IMPORT_KIT = "IMPORT_KIT";
export const UPDATE_CURRENT_KIT_ID = "UPDATE_CURRENT_KIT_ID";
export const UPDATE_CURRENT_STYLE_ID = "UPDATE_CURRENT_STYLE_ID";
export const UPDATE_CURRENT_STYLE = "UPDATE_CURRENT_STYLE";
export const UPDATE_EXTRA_FONT_STYLES = "UPDATE_EXTRA_FONT_STYLES";
export const PUBLISH = "PUBLISH";
export const ADD_FONTS = "ADD_FONTS";
export const DELETE_FONTS = "DELETE_FONTS";
export const UPDATE_SCREENSHOT = "UPDATE_SCREENSHOT";
export const UPDATE_DISABLED_ELEMENTS = "UPDATE_DISABLED_ELEMENTS";
export const UPDATE_TRIGGERS = "UPDATE_TRIGGERS";
export const UPDATE_ERROR = "UPDATE_ERROR";

export function hydrate({
  project,
  projectStatus,
  fonts,
  page,
  globalBlocks,
  savedBlocks,
  blocksThumbnailSizes
}) {
  return {
    type: HYDRATE,
    payload: {
      project,
      projectStatus,
      fonts,
      page,
      globalBlocks,
      savedBlocks,
      blocksThumbnailSizes
    }
  };
}

export function editorRendered() {
  return {
    type: EDITOR_RENDERED
  };
}

// project

export function updateCurrentStyleId(id) {
  return {
    type: UPDATE_CURRENT_STYLE_ID,
    payload: id
  };
}

export function updateCurrentStyle(currentStyle) {
  return {
    type: UPDATE_CURRENT_STYLE,
    payload: currentStyle
  };
}

export function updateExtraFontStyles(extraFontStyles) {
  return {
    type: UPDATE_EXTRA_FONT_STYLES,
    payload: extraFontStyles
  };
}

export function updateCurrentKitId(id) {
  return {
    type: UPDATE_CURRENT_KIT_ID,
    payload: id
  };
}

export function publish() {
  return dispatch => {
    return new Promise((res, rej) => {
      dispatch({
        type: PUBLISH,
        meta: {
          onSuccess: res,
          onError: rej
        }
      });
    });
  };
}

export function deleteFont({ type, fonts: removedFonts }) {
  return (dispatch, getState) => {
    const fonts = fontSelector(getState());
    const fontData = (fonts[type] && fonts[type].data) || [];
    const dataFonts = {
      [`${type}`]: {
        data: fontData.map(font =>
          removedFonts.some(({ brizyId }) => brizyId === font.brizyId)
            ? { ...font, deleted: true }
            : font
        )
      }
    };

    return dispatch({
      type: DELETE_FONTS,
      payload: mergeDeep(fonts, dataFonts)
    });
  };
}

export function updateRules({ data, meta }) {
  return {
    type: UPDATE_RULES,
    payload: data,
    meta
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

export function updateBlocks({ blocks, meta }) {
  return {
    type: UPDATE_BLOCKS,
    payload: {
      blocks
    },
    meta: {
      is_autosave: 1,
      ...meta
    }
  };
}

export function addBlock(block, meta = {}) {
  return {
    type: ADD_BLOCK,
    payload: block,
    meta
  };
}

export function removeBlock({ index }) {
  return {
    type: REMOVE_BLOCK,
    payload: {
      index
    }
  };
}

export function reorderBlocks({ oldIndex, newIndex }) {
  return {
    type: REORDER_BLOCKS,
    payload: {
      oldIndex,
      newIndex
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

export function deleteGlobalBlock({ id }) {
  return {
    type: DELETE_GLOBAL_BLOCK,
    payload: {
      id
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

// templates

export function importTemplate(template, meta = {}) {
  return {
    type: IMPORT_TEMPLATE,
    payload: template,
    meta
  };
}

// kits

export function importKit(kit) {
  return {
    type: IMPORT_KIT,
    payload: kit
  };
}

// ui

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

// disabled elements
export function updateDisabledElements(value) {
  return {
    type: UPDATE_DISABLED_ELEMENTS,
    payload: value
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

export function updateScreenshot({ blockId, data, meta }) {
  return {
    type: UPDATE_SCREENSHOT,
    payload: {
      blockId,
      data
    },
    meta
  };
}

// error

export function updateError(data) {
  return {
    type: UPDATE_ERROR,
    payload: data
  };
}
