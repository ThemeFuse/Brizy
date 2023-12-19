import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";

type ExtraFontStyles = ReduxState["extraFontStyles"];
type RExtraFontStyles = (s: ExtraFontStyles, a: ReduxAction) => ExtraFontStyles;

export const extraFontStyles: RExtraFontStyles = (state = [], action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;

      return project.data.extraFontStyles;
    }
    case "UPDATE_EXTRA_FONT_STYLES": {
      return action.payload;
    }
    case ActionTypes.IMPORT_TEMPLATE:
    case "ADD_BLOCK":
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      const { extraFontStyles } = action.payload;

      if (!extraFontStyles || extraFontStyles.length === 0) {
        return state;
      }

      return [...state, ...extraFontStyles];
    }
    default:
      return state;
  }
};
