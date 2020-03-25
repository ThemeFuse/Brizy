import _ from "underscore";
import { mergeDeep } from "timm";
import { ThunkAction } from "redux-thunk";
import { uuid } from "visual/utils/uuid";
import { fontSelector } from "visual/redux/selectors";
import { ReduxState } from "./types";
import { GoogleFont, UploadedFont } from "visual/types";

/// actions

export type ActionUpdateGlobalBlock = {
  type: "UPDATE_GLOBAL_BLOCK";
  payload: {
    id: string;
    data: object;
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

export type UpdateUIAction = {
  type: "UPDATE_UI";
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

/// action creators

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

export type AddFontsPayload = {
  type: "config" | "blocks" | "google" | "upload";
  fonts: (GoogleFont | UploadedFont)[];
}[];
export function addFonts(
  addedFonts: AddFontsPayload
): ThunkAction<ActionAddFonts, ReduxState, null, ActionAddFonts> {
  return (dispatch, getState): ActionAddFonts => {
    const usedFonts: ReduxState["fonts"] = fontSelector(getState());
    const newFonts = addedFonts.reduce((acc, curr) => {
      const { type, fonts } = curr;

      // current version of tsc (3.7.3) does not allow
      // calling map on (GoogleFont[] | UploadFont[])
      // but does on (GoogleFont | UploadedFont)[]
      const fontData: (GoogleFont | UploadedFont)[] =
        usedFonts[type]?.data || [];

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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateUI(key: string, value: any): UpdateUIAction {
  return {
    type: "UPDATE_UI",
    key,
    value
  };
}
