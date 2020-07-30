import { mergeDeep } from "timm";
import { fontSelector } from "./selectors2";

export const HYDRATE = "HYDRATE";
export const EDITOR_RENDERED = "EDITOR_RENDERED";
export const UPDATE_BLOCKS = "UPDATE_BLOCKS";
export const REMOVE_BLOCK = "REMOVE_BLOCK";
export const REMOVE_BLOCKS = "REMOVE_BLOCKS";
export const REORDER_BLOCKS = "REORDER_BLOCKS";
export const MAKE_NORMAL_TO_GLOBAL_BLOCK = "MAKE_NORMAL_TO_GLOBAL_BLOCK";
export const MAKE_POPUP_TO_GLOBAL_BLOCK = "MAKE_POPUP_TO_GLOBAL_BLOCK";
export const MAKE_GLOBAL_BLOCK_TO_POPUP = "MAKE_GLOBAL_BLOCK_TO_POPUP";
export const UPDATE_GLOBAL_BLOCK = "UPDATE_GLOBAL_BLOCK";
export const DELETE_GLOBAL_BLOCK = "DELETE_GLOBAL_BLOCK";
export const CREATE_RULES = "CREATE_RULES";
export const UPDATE_POPUP_RULES = "UPDATE_POPUP_RULES";
export const UPDATE_UI = "UPDATE_UI";
export const COPY_ELEMENT = "COPY_ELEMENT";
export const IMPORT_TEMPLATE = "IMPORT_TEMPLATE";
export const IMPORT_KIT = "IMPORT_KIT";
export const UPDATE_CURRENT_KIT_ID = "UPDATE_CURRENT_KIT_ID";
export const UPDATE_CURRENT_STYLE_ID = "UPDATE_CURRENT_STYLE_ID";
export const UPDATE_CURRENT_STYLE = "UPDATE_CURRENT_STYLE";
export const ADD_FONTS = "ADD_FONTS";
export const DELETE_FONTS = "DELETE_FONTS";
export const UPDATE_SCREENSHOT = "UPDATE_SCREENSHOT";
export const UPDATE_DISABLED_ELEMENTS = "UPDATE_DISABLED_ELEMENTS";
export const UPDATE_GB_RULES = "UPDATE_GB_RULES";
export const UPDATE_TRIGGERS = "UPDATE_TRIGGERS";
export const ADD_GLOBAL_BLOCK = "ADD_GLOBAL_BLOCK";
export const MAKE_GLOBAL_TO_NORMAL_BLOCK = "MAKE_GLOBAL_TO_NORMAL_BLOCK";
export const ADD_BLOCK = "ADD_BLOCK";
export const UPDATE_ERROR = "UPDATE_ERROR";
export const UPDATE_AUTHORIZATION = "UPDATE_AUTHORIZATION";

export function hydrate({
  project,
  projectStatus,
  fonts,
  page,
  globalBlocks,
  blocksThumbnailSizes,
  authorized,
  syncAllowed
}) {
  return {
    type: HYDRATE,
    payload: {
      project,
      projectStatus,
      fonts,
      page,
      globalBlocks,
      blocksThumbnailSizes,
      authorized,
      syncAllowed
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

export function updateCurrentKitId(id) {
  return {
    type: UPDATE_CURRENT_KIT_ID,
    payload: id
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

export function updatePopupRules({ data, meta }) {
  return {
    type: UPDATE_POPUP_RULES,
    payload: data,
    meta
  };
}

// pages

// globalBlocks

// kits

export function importKit(kit) {
  return {
    type: IMPORT_KIT,
    payload: kit
  };
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
