import { produce } from "immer";
import { ThunkAction } from "redux-thunk";
import { mergeDeep } from "timm";
import _ from "underscore";
import { Layout } from "visual/component/Prompts/common/PromptPage/types";
import { PublishData } from "visual/global/Config/types/configs/ConfigCommon";
import { fontsSelector } from "visual/redux/selectors";
import {
  ActiveElement,
  AdobeFont,
  Authorized,
  Block,
  DeviceMode,
  ExtraFontStyle,
  Font,
  GlobalBlock,
  GlobalBlockNormal,
  GlobalBlockPopup,
  GoogleFont,
  Screenshot,
  ShopifyPage,
  Style,
  SystemFont,
  UploadedFont
} from "visual/types";
import { ArrayType } from "visual/utils/array/types";
import { uuid } from "visual/utils/uuid";
import { ReduxState, StoreChanged } from "./types";

type UIState = ReduxState["ui"];

type SyncAllowed = ReduxState["syncAllowed"];

type RFonts = ReduxState["fonts"];

type Error = ReduxState["error"];

type CopyElementPayload = ReduxState["copiedElement"];

type StrictFonts = Required<RFonts>;
export type FontKeyTypes = keyof StrictFonts;

type FontPayload<T extends FontKeyTypes> = {
  id?: string;
  type: T;
  fonts: ArrayType<StrictFonts[T]["data"]>[];
};

export type FontsPayload = FontPayload<FontKeyTypes>[];

/// actions

export type ActionHydrate = {
  type: "HYDRATE";
  payload: {
    project: ReduxState["project"];
    projectStatus: {
      locked: boolean;
      lockedBy: boolean | { user_email: string };
    };
    globalBlocks: ReduxState["globalBlocks"];
    fonts: RFonts;
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

//#region Global Blocks

export type ActionMakeBlockToGlobalBlock = {
  type: "MAKE_BLOCK_TO_GLOBAL_BLOCK";
  payload: { block: GlobalBlockNormal; fromBlockId: string };
};

export type ActionMakeGlobalBlockToBlock = {
  type: "MAKE_GLOBAL_BLOCK_TO_BLOCK";
  payload: { block: Block; fromBlockId: string };
};

export type ActionUpdateGlobalBlock = {
  type: "UPDATE_GLOBAL_BLOCK";
  payload: {
    uid: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    title?: string;
    tags?: string;
  };
  meta: {
    is_autosave: 0 | 1;
  };
};

export const ADD_GLOBAL_BLOCK = "ADD_GLOBAL_BLOCK";

export type ActionAddGlobalBlock = {
  type: typeof ADD_GLOBAL_BLOCK;
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
    id: string;
  };
};

//#endregion

//#region Global Popup

export type ActionMakePopupToGlobalPopup = {
  type: "MAKE_POPUP_TO_GLOBAL_POPUP";
  payload: {
    block: GlobalBlockPopup;
    fromBlockId: string;
    type: "popup" | "externalPopup";
  };
};

export type ActionMakeGlobalPopupToPopup = {
  type: "MAKE_GLOBAL_POPUP_TO_POPUP";
  payload: { block: Block; fromBlockId: string; parentId: string };
};

export const ADD_GLOBAL_POPUP = "ADD_GLOBAL_POPUP";

export type ActionAddGlobalPopup = {
  type: typeof ADD_GLOBAL_POPUP;
  payload: {
    block: Block;
    fonts: FontsPayload;
    extraFontStyles?: ReduxState["extraFontStyles"];
  };
  meta: {
    insertIndex: number;
  };
};

export type ActionUpdatePopupRules = {
  type: "UPDATE_POPUP_RULES";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any; // TODO need change any to normal value @Alex T
};

//#endregion

export const UPDATE_DISABLED_ELEMENTS = "UPDATE_DISABLED_ELEMENTS";

export type ActionDisabledElements = {
  type: typeof UPDATE_DISABLED_ELEMENTS;
  payload: string[];
};

export type ActionPinnedElements = {
  type: ActionTypes.UPDATE_PINNED_ELEMENTS;
  payload: string[];
};

export const UPDATE_CURRENT_KIT_ID = "UPDATE_CURRENT_KIT_ID";

export type ActionUpdateKitId = {
  type: typeof UPDATE_CURRENT_KIT_ID;
  payload: string;
};

export const ADD_FONTS = "ADD_FONTS";

export type ActionAddFonts = {
  type: "ADD_FONTS";
  payload: RFonts;
};

export const DELETE_FONTS = "DELETE_FONTS";

export type ActionDeleteFont = {
  type: typeof DELETE_FONTS;
  payload: RFonts;
};

export const UPDATE_DEFAULT_FONT = "UPDATE_DEFAULT_FONT";

export interface ActionUpdateDefaultFont {
  type: typeof UPDATE_DEFAULT_FONT;
  payload: string;
}

export type ActionUpdateTriggers = {
  type: "UPDATE_TRIGGERS";
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any; // TODO need change any to normal value @Alex T
  };
};

type ActionUpdateUITmp<K extends keyof UIState> = {
  type: "UPDATE_UI";
  key: K;
  value: UIState[K];
};
export type ActionUpdateUI = ActionUpdateUITmp<keyof UIState>;

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
  type: ActionTypes.REMOVE_BLOCK;
  payload: {
    index: number;
    id: string;
  };
};

export type ActionRemoveBlocks = {
  type: ActionTypes.REMOVE_BLOCKS;
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

export type ActionStoreWasChanged = {
  type: "STORE_WAS_CHANGED";
  payload: StoreChanged;
};

export type ReduxAction =
  | ActionHydrate
  | ActionUpdateGlobalBlock
  | ActionAddFonts
  | ActionDeleteFont
  | ActionUpdateDefaultFont
  | ActionUpdateUI
  | ActionUpdateAuthorized
  | ActionUpdateSyncAllowed
  | ActionUpdateTriggers
  | ActionUpdatePopupRules
  | ActionUpdatePageStatus
  | ActionUpdateKitId
  | ActionDisabledElements
  | ActionPinnedElements
  | ActionUpdatePageLayout
  | ActionUpdateIsHomePage
  | ActionFetchPageSuccess
  | ActionUpdateExtraFontStyles
  | ActionUpdateCurrentStyle
  | ActionCopyElement
  | ActionUpdateError
  | ActionUpdateScreenshot
  | ActionImportTemplate
  | ActionImportKit
  | ActionImportStory
  | ActionAddBlock
  | ActionAddGlobalBlock
  | ActionAddGlobalPopup
  | ActionDeleteGlobalBlock
  | ActionRemoveBlock
  | ActionUpdateGBRules
  | ActionRemoveBlocks
  | ActionReorderBlocks
  | ActionUpdateBlocks
  | ActionMakeBlockToGlobalBlock
  | ActionMakeGlobalBlockToBlock
  | ActionMakePopupToGlobalPopup
  | ActionMakeGlobalPopupToPopup
  | ActionStoreWasChanged
  | ActionUpdatePageTitle
  | AddNewGlobalStyle
  | RemoveGlobalStyle
  | EditGlobalStyleName
  | UpdateCurrentStyleId
  | RegenerateColors
  | RegenerateTypography;

export type ActionUpdateAuthorized = {
  type: "UPDATE_AUTHORIZATION";
  payload: Authorized;
};

//#region Page

export type ActionUpdatePageTitle = {
  type: "UPDATE_PAGE_TITLE";
  payload: string;
};

//#endregion

export type ActionUpdateSyncAllowed = {
  type: "UPDATE_SYNC_ALLOWED";
  payload: SyncAllowed;
};

export const PUBLISH = "PUBLISH";

interface PublishBase {
  status: ReduxState["page"]["status"];
}

interface PublishInternal extends PublishBase {
  type: "internal";
}

interface PublishExternal extends PublishBase {
  type: "external";
  res: (data: PublishData) => void;
}

type PublishPayload = PublishInternal | PublishExternal;

export type ActionUpdatePageStatus = {
  type: typeof PUBLISH;
  payload: PublishPayload;
  meta?: {
    onSuccess: (s?: void) => void;
    onError: (e?: void) => void;
  };
};

export type ActionUpdatePageLayout = {
  type: "UPDATE_PAGE_LAYOUT";
  payload: {
    layout: ShopifyPage["layout"]["value"];
  };
};

export type ActionUpdateIsHomePage = {
  type: "UPDATE_PAGE_IS_HOME_PAGE";
  payload: {
    isHomePage: ShopifyPage["layout"]["isHomePage"];
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

export type ActionUpdateCurrentStyle = {
  type: ActionTypes.UPDATE_CURRENT_STYLE;
  payload: ReduxState["currentStyle"];
};

export type ActionCopyElement = {
  type: ActionTypes.COPY_ELEMENT;
  value: ReduxState["copiedElement"];
};

export type ActionUpdateError = {
  type: ActionTypes.UPDATE_ERROR;
  payload: ReduxState["error"];
};

export type ActionUpdateScreenshot = {
  type: ActionTypes.UPDATE_SCREENSHOT;
  payload: {
    blockId: string;
    data: Screenshot;
  };
  meta?: {
    blockType?: "normal" | "global" | "popup";
    action?: "create" | "update";
  };
};

/// action creators

export { redo, undo } from "./history/actions";

export function makeNormalToGlobalBlock({
  fromBlockId,
  block
}: {
  fromBlockId: string;
  block: GlobalBlockNormal;
}): ActionMakeBlockToGlobalBlock {
  return {
    type: "MAKE_BLOCK_TO_GLOBAL_BLOCK",
    payload: {
      fromBlockId,
      block
    }
  };
}

export function makeGlobalToNormalBlock({
  fromBlockId,
  block
}: {
  fromBlockId: string;
  block: Block;
}): ActionMakeGlobalBlockToBlock {
  return {
    type: "MAKE_GLOBAL_BLOCK_TO_BLOCK",
    payload: {
      fromBlockId,
      block
    }
  };
}

export function makePopupToGlobalBlock({
  fromBlockId,
  block,
  type
}: {
  fromBlockId: string;
  block: GlobalBlockPopup;
  type: "popup" | "externalPopup";
}): ActionMakePopupToGlobalPopup {
  return {
    type: "MAKE_POPUP_TO_GLOBAL_POPUP",
    payload: {
      fromBlockId,
      block,
      type
    }
  };
}

export function makeGlobalBlockToPopup({
  fromBlockId,
  parentId,
  block
}: {
  fromBlockId: string;
  block: Block;
  parentId: string;
}): ActionMakeGlobalPopupToPopup {
  return {
    type: "MAKE_GLOBAL_POPUP_TO_POPUP",
    payload: {
      fromBlockId,
      parentId,
      block
    }
  };
}

export function updateGlobalBlock({
  uid,
  data,
  title,
  tags,
  meta
}: {
  uid: string;
  data: GlobalBlock["data"];
  title?: string;
  tags?: string;
  meta?: {
    is_autosave?: 1 | 0;
    sourceBlockId?: string;
  };
}): ActionUpdateGlobalBlock {
  return {
    type: "UPDATE_GLOBAL_BLOCK",
    payload: { uid, data, title, tags },
    meta: {
      is_autosave: 1,
      ...meta
    }
  };
}

// project

export const updateCurrentKitId = (payload: string): ActionUpdateKitId => {
  return {
    type: "UPDATE_CURRENT_KIT_ID",
    payload
  };
};

export const updateDisabledElements = (
  payload: string[]
): ActionDisabledElements => {
  return {
    type: "UPDATE_DISABLED_ELEMENTS",
    payload
  };
};

export const updatePinnedElements = (
  payload: string[]
): ActionPinnedElements => ({
  type: ActionTypes.UPDATE_PINNED_ELEMENTS,
  payload
});

type ThunkAddFonts = (
  a: FontsPayload
) => ThunkAction<void, ReduxState, unknown, ActionAddFonts>;

export const addFonts: ThunkAddFonts =
  (addedFonts) =>
  (dispatch, getState): ActionAddFonts => {
    const usedFonts = fontsSelector(getState());
    const newFonts = addedFonts.reduce((acc, curr) => {
      const { id, type, fonts } = curr;

      // current version of tsc (3.7.3) does not allow
      // calling map on (GoogleFont[] | UploadFont[])
      // but does on (GoogleFont | UploadedFont)[]
      const fontData: (GoogleFont | UploadedFont | AdobeFont | SystemFont)[] =
        usedFonts[type]?.data || [];

      // Separated Deleted Font with Normal Font
      const [deletedFonts, normalFont] = _.partition(fonts, (font) =>
        Object.prototype.hasOwnProperty.call(font, "deleted")
      );
      const newFonts = normalFont.map((font) => ({
        ...font,
        brizyId: uuid()
      }));

      const _id = id ? { id } : {};

      // Make new Data, check deleted Font
      return {
        ...acc,
        [type]: {
          ..._id,
          data: fontData
            .map(
              (font) =>
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

type ThunkDeleteFonts = (
  a: FontPayload<FontKeyTypes>
) => ThunkAction<void, ReduxState, unknown, ActionDeleteFont>;

export const deleteFont: ThunkDeleteFonts =
  (payload) =>
  (dispatch, getState): ActionDeleteFont => {
    const { type, fonts: removedFonts } = payload;
    const fonts = produce(fontsSelector(getState()), (draft) => {
      if (type === "adobe") {
        delete draft["adobe"];
      }
    });
    const fontData: Font[] = (fonts[type] && fonts[type]?.data) || [];

    const dataFonts = {
      [type]: {
        data: fontData.map((font) =>
          removedFonts.some(({ brizyId }) => brizyId === font.brizyId)
            ? { ...font, deleted: true }
            : font
        )
      }
    };

    return dispatch({
      type: "DELETE_FONTS",
      payload: mergeDeep(fonts, dataFonts)
    });
  };

export const updateDefaultFont = (font: string): ActionUpdateDefaultFont => {
  return {
    type: "UPDATE_DEFAULT_FONT",
    payload: font
  };
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

export const updateStoreWasChanged = (
  payload: ReduxState["storeWasChanged"]
): ActionStoreWasChanged => {
  return {
    type: "STORE_WAS_CHANGED",
    payload
  };
};

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

export const updatePageStatus: ThunkPublishPage =
  (status) =>
  (dispatch): Promise<void> => {
    return new Promise((res, rej) => {
      dispatch({
        type: "PUBLISH",
        payload: { status, type: "internal" },
        meta: {
          onSuccess: res,
          onError: rej
        }
      });
    });
  };

export const updatePageLayout = (layout: Layout): ActionUpdatePageLayout => {
  return {
    type: "UPDATE_PAGE_LAYOUT",
    payload: { layout }
  };
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

export function addGlobalPopup(
  block: { block: Block; fonts: FontsPayload },
  meta = { insertIndex: 0 }
): ActionAddGlobalPopup {
  return {
    type: "ADD_GLOBAL_POPUP",
    payload: block,
    meta
  };
}

export function deleteGlobalBlock({
  id
}: {
  id: string;
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
    type: ActionTypes.REMOVE_BLOCK,
    payload: {
      index,
      id
    }
  };
}

export function removeBlocks(): ActionRemoveBlocks {
  return {
    type: ActionTypes.REMOVE_BLOCKS
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

// UI

export function setDeviceMode(mode: DeviceMode): ActionUpdateUI {
  return updateUI("deviceMode", mode);
}

export function setActiveElement(element: ActiveElement): ActionUpdateUI {
  return updateUI("activeElement", element);
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

// updatePageTitle

export function updatePageTitle(title: string): ActionUpdatePageTitle {
  return {
    type: "UPDATE_PAGE_TITLE",
    payload: title
  };
}

export const updatePageIsHomePage = (
  isHomePage: string | null
): ActionUpdateIsHomePage => {
  return {
    type: "UPDATE_PAGE_IS_HOME_PAGE",
    payload: { isHomePage }
  };
};

//#region Add New Global Style

export enum ActionTypes {
  "ADD_NEW_GLOBAL_STYLE" = "ADD_NEW_GLOBAL_STYLE",
  "EDIT_GLOBAL_STYLE_NAME" = "EDIT_GLOBAL_STYLE_NAME",
  "REMOVE_GLOBAL_STYLE" = "REMOVE_GLOBAL_STYLE",
  "IMPORT_KIT" = "IMPORT_KIT",
  "IMPORT_STORY" = "IMPORT_STORY",
  "IMPORT_TEMPLATE" = "IMPORT_TEMPLATE",
  "UPDATE_CURRENT_STYLE_ID" = "UPDATE_CURRENT_STYLE_ID",
  "UPDATE_CURRENT_STYLE" = "UPDATE_CURRENT_STYLE",
  "COPY_ELEMENT" = "COPY_ELEMENT",
  "UPDATE_ERROR" = "UPDATE_ERROR",
  "UPDATE_SCREENSHOT" = "UPDATE_SCREENSHOT",
  "REMOVE_BLOCK" = "REMOVE_BLOCK",
  "REMOVE_BLOCKS" = "REMOVE_BLOCKS",
  "UPDATE_PINNED_ELEMENTS" = "UPDATE_PINNED_ELEMENTS",
  "REGENERATE_COLORS" = "REGENERATE_COLORS",
  "REGENERATE_TYPOGRAPHY" = "REGENERATE_TYPOGRAPHY"
}

// templates

export type ActionImportTemplate = {
  type: ActionTypes.IMPORT_TEMPLATE;
  payload: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<ExtraFontStyle>;
    styles?: Style[];
    currentStyleId?: string;
  };
  meta: {
    insertIndex: number;
  };
};

export const importTemplate = (
  template: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<ExtraFontStyle>;
  },
  meta = { insertIndex: 0 }
): ActionImportTemplate => ({
  meta,
  type: ActionTypes.IMPORT_TEMPLATE,
  payload: template
});

export const updateCurrentStyle = (currentStyle: Style) => ({
  type: ActionTypes.UPDATE_CURRENT_STYLE,
  payload: currentStyle
});

export type ActionImportStory = {
  type: ActionTypes.IMPORT_STORY;
  payload: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
    styles?: Style[];
    currentStyleId?: string;
  };
  meta: {
    insertIndex: number;
  };
};

export const importStory = (
  story: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles: Array<{ id: string }>;
  },
  meta = { insertIndex: 0 }
): ActionImportStory => ({
  type: ActionTypes.IMPORT_STORY,
  payload: story,
  meta
});

export interface ActionImportKit {
  type: ActionTypes.IMPORT_KIT;
  payload: {
    selectedKit: string;
    styles: Style[];
    fonts: FontsPayload;
  };
}

// kit

interface Kit {
  selectedKit: string;
  styles: Style[];
  fonts: FontsPayload;
}

export const importKit = (payload: Kit): ActionImportKit => ({
  type: ActionTypes.IMPORT_KIT,
  payload
});

export interface RegenerateColors {
  type: ActionTypes.REGENERATE_COLORS;
  payload: Style;
}

export const getRegenerateColors = (payload: Style): RegenerateColors => ({
  type: ActionTypes.REGENERATE_COLORS,
  payload
});

export interface RegenerateTypography {
  type: ActionTypes.REGENERATE_TYPOGRAPHY;
  payload: Style;
}

export const getRegenerateTypography = (
  payload: Style
): RegenerateTypography => ({
  type: ActionTypes.REGENERATE_TYPOGRAPHY,
  payload
});

export type AddNewGlobalStyle = {
  type: ActionTypes.ADD_NEW_GLOBAL_STYLE;
  payload: Style;
};

export type EditGlobalStyleName = {
  type: ActionTypes.EDIT_GLOBAL_STYLE_NAME;
  payload: string;
};

export const addNewGlobalStyle = (payload: Style): AddNewGlobalStyle => ({
  type: ActionTypes.ADD_NEW_GLOBAL_STYLE,
  payload
});

export const editGlobalStyleName = (payload: string): EditGlobalStyleName => ({
  type: ActionTypes.EDIT_GLOBAL_STYLE_NAME,
  payload
});

export type RemoveGlobalStyle = {
  type: ActionTypes.REMOVE_GLOBAL_STYLE;
  payload: string;
};

export const removeGlobalStyle = (payload: string): RemoveGlobalStyle => ({
  type: ActionTypes.REMOVE_GLOBAL_STYLE,
  payload
});

export type UpdateCurrentStyleId = {
  type: ActionTypes.UPDATE_CURRENT_STYLE_ID;
  payload: string;
};

export const updateCurrentStyleId = (
  payload: string
): UpdateCurrentStyleId => ({
  type: ActionTypes.UPDATE_CURRENT_STYLE_ID,
  payload
});

//#endregion

// copy

export function updateCopiedElement(
  value: CopyElementPayload
): ActionCopyElement {
  return {
    type: ActionTypes.COPY_ELEMENT,
    value
  };
}

// error

export function updateError(data: Error): ActionUpdateError {
  return {
    type: ActionTypes.UPDATE_ERROR,
    payload: data
  };
}

// screenshots

interface ScreenshotPayload {
  blockId: string;
  data: Screenshot;
  meta?: ActionUpdateScreenshot["meta"];
}

export function updateScreenshot({
  blockId,
  data,
  meta
}: ScreenshotPayload): ActionUpdateScreenshot {
  return {
    type: ActionTypes.UPDATE_SCREENSHOT,
    payload: {
      blockId,
      data
    },
    meta
  };
}
