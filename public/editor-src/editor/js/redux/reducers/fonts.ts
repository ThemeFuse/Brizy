import produce from "immer";
import { ActionTypes, ReduxAction } from "../actions2";
import { ReduxState } from "../types";

type Fonts = ReduxState["fonts"];
type RFonts = (s: Fonts, a: ReduxAction) => Fonts;

export const fonts: RFonts = (state = {}, action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { fonts } = action.payload;

      return fonts;
    }
    case "ADD_FONTS":
    case "DELETE_FONTS": {
      const fonts = action.payload;

      if (!fonts) {
        return state;
      }

      return { ...state, ...fonts };
    }
    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE:
    case ActionTypes.IMPORT_KIT:
    case "ADD_BLOCK":
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      const { fonts } = action.payload;

      if (!fonts || fonts.length === 0) {
        return state;
      }

      return produce(state, (draft) => {
        fonts.forEach(({ type, fonts }) => {
          // @ts-expect-error: Is not assignable to type fonts
          draft[type] = draft[type] || { data: [] };

          // @ts-expect-error: Object is possibly 'undefined'.
          draft[type].data.push(...fonts);
        });
      });
    }
    default:
      return state;
  }
};
