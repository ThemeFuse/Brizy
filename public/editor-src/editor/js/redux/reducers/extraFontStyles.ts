import { ReduxState } from "visual/redux/types";
import { ReduxAction } from "visual/redux/actions2";

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
    case "IMPORT_TEMPLATE":
    case "ADD_BLOCK":
    case "ADD_GLOBAL_BLOCK": {
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
