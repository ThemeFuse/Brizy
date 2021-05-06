import _ from "underscore";
import { mergeDeep } from "timm";
import { ThunkAction } from "redux-thunk";
import { uuid } from "visual/utils/uuid";
import { ReduxState } from "./types";
import {
  Authorized,
  Block,
  DeviceMode,
  GlobalBlock,
  GoogleFont,
  UploadedFont
} from "visual/types";
import { fontSelector } from "visual/redux/selectors";

type UIState = ReduxState["ui"];

type SyncAllowed = ReduxState["syncAllowed"];

/// actions

export type ActionHydrate = {
  type: "HYDRATE";
  payload: {
    project: {
      data: {
        extraFontStyles: Array<{ id: string }>;
      };
    };
    projectStatus: {};
    blocksThumbnailSizes: [];
    globalBlocks: ReduxState["globalBlocks"];
    fonts: ReduxState["fonts"];
    page: ReduxState["page"];
    authorized: ReduxState["authorized"];
    syncAllowed: ReduxState["syncAllowed"];
  };
};

export type ActionUpdateBlocks = {
  type: "UPDATE_BLOCKS";
  payload: {
    blocks: Block[];
  };
  meta: {
    is_autosave: 1 | 0;
  };
};

export type ActionMakeNormalToGlobalBlock = {
  type: "MAKE_NORMAL_TO_GLOBAL_BLOCK";
  payload: GlobalBlock;
};

export type ActionMakeGlobalToNormalBlock = {
  type: "MAKE_GLOBAL_TO_NORMAL_BLOCK";
  payload: { block: Block; fromBlockId: string };
};

export type ActionMakePopupToGlobalBlock = {
  type: "MAKE_POPUP_TO_GLOBAL_BLOCK";
  payload: GlobalBlock;
};

export type ActionMakeGlobalBlockToPopup = {
  type: "MAKE_GLOBAL_BLOCK_TO_POPUP";
  payload: { block: Block; fromBlockId: string };
};

export type ActionUpdateGlobalBlock = {
  type: "UPDATE_GLOBAL_BLOCK";
  payload: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
  meta: {
    is_autosave: 0 | 1;
  };
};

export type ActionAddFonts = {
  type: "ADD_FONTS";
  payload: {
    config?: {
      data: GoogleFont[];
    };
    blocks?: {
      data: GoogleFont[];
    };
    google?: {
      data: GoogleFont[];
    };
    upload?: {
      data: UploadedFont[];
    };
  };
};

export type ActionUpdateTriggers = {
  type: "UPDATE_TRIGGERS";
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any; // TODO need change any to normal value @Alex T
  };
};

export type ActionUpdatePopupRules = {
  type: "UPDATE_POPUP_RULES";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any; // TODO need change any to normal value @Alex T
};

type ActionUpdateUITmp<K extends keyof UIState> = {
  type: "UPDATE_UI";
  key: K;
  value: UIState[K];
};
export type ActionUpdateUI = ActionUpdateUITmp<keyof UIState>;

export type ActionAddGlobalBlock = {
  type: "ADD_GLOBAL_BLOCK";
  payload: {
    block: Block;
    fonts: FontsPayload;
    extraFontStyles?: ReduxState["extraFontStyles"];
  };
  meta: {
    insertIndex: number;
  };
};

export type ActionDeleteGlobalBlock = {
  type: "DELETE_GLOBAL_BLOCK";
  payload: {
    id: number;
  };
};

export type ActionAddBlock = {
  type: "ADD_BLOCK";
  payload: {
    block: Block;
    fonts: FontsPayload;
    extraFontStyles?: ReduxState["extraFontStyles"];
  };
  meta: {
    insertIndex: number;
  };
};

export type ActionRemoveBlock = {
  type: "REMOVE_BLOCK";
  payload: {
    index: number;
    id: string;
  };
};

export type ActionRemoveBlocks = {
  type: "REMOVE_BLOCKS";
};

export type ActionUpdateGBRules = {
  type: "UPDATE_GB_RULES";
  payload: {
    rules: GlobalBlock["rules"];
    id: string;
  };
  meta: {
    syncSuccess: (s?: void) => void;
    syncFail: (e?: void) => void;
  };
};

export type ActionReorderBlocks = {
  type: "REORDER_BLOCKS";
  payload: {
    oldIndex: number;
    newIndex: number;
  };
};

export type ReduxAction =
  | ActionHydrate
  | ActionUpdateGlobalBlock
  | ActionAddFonts
  | ActionUpdateUI
  | ActionUpdateAuthorized
  | ActionUpdateSyncAllowed
  | ActionUpdateTriggers
  | ActionUpdatePopupRules
  | ActionUpdatePageStatus
  | ActionFetchPageSuccess
  | ActionUpdateExtraFontStyles
  | ActionImportTemplate
  | ActionImportStory
  | ActionAddBlock
  | ActionAddGlobalBlock
  | ActionDeleteGlobalBlock
  | ActionRemoveBlock
  | ActionUpdateGBRules
  | ActionRemoveBlocks
  | ActionReorderBlocks
  | ActionUpdateBlocks
  | ActionMakeNormalToGlobalBlock
  | ActionMakeGlobalToNormalBlock
  | ActionMakePopupToGlobalBlock
  | ActionMakeGlobalBlockToPopup;

export type ActionImportTemplate = {
  type: "IMPORT_TEMPLATE";
  payload: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
  };
  meta: {
    insertIndex: number;
  };
};

export const IMPORT_STORY = "IMPORT_STORY";
export type ActionImportStory = {
  type: typeof IMPORT_STORY;
  payload: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
  };
  meta: {
    insertIndex: number;
  };
};

export type ActionUpdateAuthorized = {
  type: "UPDATE_AUTHORIZATION";
  payload: Authorized;
};

export type ActionUpdateSyncAllowed = {
  type: "UPDATE_SYNC_ALLOWED";
  payload: SyncAllowed;
};

export type FontsPayload = {
  type: "config" | "blocks" | "google" | "upload";
  fonts: (GoogleFont | UploadedFont)[];
}[];

export const PUBLISH = "PUBLISH";

export type ActionUpdatePageStatus = {
  type: typeof PUBLISH;
  payload: {
    status: ReduxState["page"]["status"];
  };
  meta?: {
    onSuccess: (s?: void) => void;
    onError: (e?: void) => void;
  };
};

export const FETCH_PAGE_SUCCESS = "FETCH_PAGE_SUCCESS";

export type ActionFetchPageSuccess = {
  type: typeof FETCH_PAGE_SUCCESS;
};

export const UPDATE_EXTRA_FONT_STYLES = "UPDATE_EXTRA_FONT_STYLES";

export type ActionUpdateExtraFontStyles = {
  type: typeof UPDATE_EXTRA_FONT_STYLES;
  payload: ReduxState["extraFontStyles"];
};

/// action creators

export { undo, redo } from "./history/actions";

export function makeNormalToGlobalBlock(
  globalBlock: GlobalBlock
): ActionMakeNormalToGlobalBlock {
  return {
    type: "MAKE_NORMAL_TO_GLOBAL_BLOCK",
    payload: globalBlock
  };
}

export function makeGlobalToNormalBlock({
  fromBlockId,
  block
}: {
  fromBlockId: string;
  block: Block;
}): ActionMakeGlobalToNormalBlock {
  return {
    type: "MAKE_GLOBAL_TO_NORMAL_BLOCK",
    payload: {
      fromBlockId,
      block
    }
  };
}

export function makePopupToGlobalBlock(
  globalBlock: GlobalBlock
): ActionMakePopupToGlobalBlock {
  return {
    type: "MAKE_POPUP_TO_GLOBAL_BLOCK",
    payload: globalBlock
  };
}

export function makeGlobalBlockToPopup({
  fromBlockId,
  block
}: {
  fromBlockId: string;
  block: Block;
}): ActionMakeGlobalBlockToPopup {
  return {
    type: "MAKE_GLOBAL_BLOCK_TO_POPUP",
    payload: {
      fromBlockId,
      block
    }
  };
}

export function updateGlobalBlock({
  id,
  data,
  meta
}: {
  id: string;
  data: object;
  meta?: {
    is_autosave?: 1 | 0;
    sourceBlockId?: string;
  };
}): ActionUpdateGlobalBlock {
  return {
    type: "UPDATE_GLOBAL_BLOCK",
    payload: {
      id,
      data
    },
    meta: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_autosave: 1,
      ...meta
    }
  };
}

type ThunkAddFonts = (
  a: FontsPayload
) => ThunkAction<void, ReduxState, unknown, ActionAddFonts>;

export const addFonts: ThunkAddFonts = addedFonts => (
  dispatch,
  getState
): ActionAddFonts => {
  const usedFonts = fontSelector(getState());
  const newFonts = addedFonts.reduce((acc, curr) => {
    const { type, fonts } = curr;

    // current version of tsc (3.7.3) does not allow
    // calling map on (GoogleFont[] | UploadFont[])
    // but does on (GoogleFont | UploadedFont)[]
    const fontData: (GoogleFont | UploadedFont)[] = usedFonts[type]?.data || [];

    // Separated Deleted Font with Normal Font
    const [deletedFonts, normalFont] = _.partition(fonts, font =>
      Object.prototype.hasOwnProperty.call(font, "deleted")
    );
    const newFonts = normalFont.map(font => ({ ...font, brizyId: uuid() }));

    // Make new Data, check deleted Font
    return {
      ...acc,
      [type]: {
        data: fontData
          .map(
            font =>
              deletedFonts.find(({ brizyId }) => font.brizyId === brizyId) ||
              font
          )
          .concat(newFonts)
      }
    };
  }, {});

  return dispatch({
    type: "ADD_FONTS",
    payload: mergeDeep(usedFonts, newFonts)
  });
};

export const updateExtraFontStyles = (
  styles: ReduxState["extraFontStyles"]
): ActionUpdateExtraFontStyles => {
  return {
    type: "UPDATE_EXTRA_FONT_STYLES",
    payload: styles
  };
};

export function updateUI<K extends keyof UIState>(
  key: K,
  value: UIState[K]
): ActionUpdateUI {
  return {
    type: "UPDATE_UI",
    key,
    value
  };
}

// pages

export function updateBlocks({
  blocks,
  meta = {}
}: {
  blocks: Block[];
  meta?: {
    is_autosave?: 0 | 1;
  };
}): ActionUpdateBlocks {
  return {
    type: "UPDATE_BLOCKS",
    payload: {
      blocks
    },
    meta: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      is_autosave: 1,
      ...meta
    }
  };
}

export const fetchPageSuccess = (): ActionFetchPageSuccess => ({
  type: FETCH_PAGE_SUCCESS
});

type ThunkPublishPage = (
  s: ReduxState["page"]["status"]
) => ThunkAction<Promise<void>, ReduxState, unknown, ActionUpdatePageStatus>;

export const updatePageStatus: ThunkPublishPage = status => (
  dispatch
): Promise<void> => {
  return new Promise((res, rej) => {
    dispatch({
      type: "PUBLISH",
      payload: { status },
      meta: {
        onSuccess: res,
        onError: rej
      }
    });
  });
};

export function addBlock(
  block: { block: Block; fonts: FontsPayload },
  meta = { insertIndex: 0 }
): ActionAddBlock {
  return {
    type: "ADD_BLOCK",
    payload: block,
    meta
  };
}

export function addGlobalBlock(
  block: { block: Block; fonts: FontsPayload },
  meta = { insertIndex: 0 }
): ActionAddGlobalBlock {
  return {
    type: "ADD_GLOBAL_BLOCK",
    payload: block,
    meta
  };
}

export function deleteGlobalBlock({
  id
}: {
  id: number;
}): ActionDeleteGlobalBlock {
  return {
    type: "DELETE_GLOBAL_BLOCK",
    payload: {
      id
    }
  };
}

export function updateGBRules({
  data,
  meta
}: {
  data: {
    rules: GlobalBlock["rules"];
    id: string;
  };
  meta: {
    syncSuccess: (s?: void) => void;
    syncFail: (e?: void) => void;
  };
}): ActionUpdateGBRules {
  return {
    type: "UPDATE_GB_RULES",
    payload: data,
    meta
  };
}

export function removeBlock({
  index,
  id
}: {
  index: number;
  id: string;
}): ActionRemoveBlock {
  return {
    type: "REMOVE_BLOCK",
    payload: {
      index,
      id
    }
  };
}

export function removeBlocks(): ActionRemoveBlocks {
  return {
    type: "REMOVE_BLOCKS"
  };
}

export function reorderBlocks(payload: {
  oldIndex: number;
  newIndex: number;
}): ActionReorderBlocks {
  return {
    type: "REORDER_BLOCKS",
    payload
  };
}

export function importStory(
  story: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
  },
  meta = { insertIndex: 0 }
): ActionImportStory {
  return {
    type: IMPORT_STORY,
    payload: story,
    meta
  };
}

// templates

export function importTemplate(
  template: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
  },
  meta = { insertIndex: 0 }
): ActionImportTemplate {
  return {
    meta,
    type: "IMPORT_TEMPLATE",
    payload: template
  };
}

// UI

export function setDeviceMode(mode: DeviceMode): ActionUpdateUI {
  return updateUI("deviceMode", mode);
}

// authorized

export function updateAuthorization(
  authorized: Authorized
): ActionUpdateAuthorized {
  return {
    type: "UPDATE_AUTHORIZATION",
    payload: authorized
  };
}

// syncAllowed

export function updateSyncAllowed(
  syncAllowed: SyncAllowed
): ActionUpdateSyncAllowed {
  return {
    type: "UPDATE_SYNC_ALLOWED",
    payload: syncAllowed
  };
}
