import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { Style } from "visual/types/Style";
import { MValue } from "visual/utils/value";

type CurrentStyleId = ReduxState["currentStyleId"];
type RCurrentStyleId = (
  s: CurrentStyleId,
  a: ReduxAction,
  f: ReduxState
) => CurrentStyleId;

export const REGENERATED_STYLE_TITLE = "REGENERATED";
export const REGENERATED_STYLE_UID = "u2354e9A74GE";

export const getRegeneratedStyle = (styles: Style[]): MValue<Style> =>
  styles.find(
    (style) =>
      style.title === REGENERATED_STYLE_TITLE &&
      style.id === REGENERATED_STYLE_UID
  );

export const currentStyleId: RCurrentStyleId = (
  state = "",
  action,
  fullState
) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;

      return project.data.selectedStyle;
    }
    case ActionTypes.UPDATE_CURRENT_STYLE_ID: {
      return action.payload;
    }
    case ActionTypes.ADD_NEW_GLOBAL_STYLE: {
      return action.payload.id;
    }
    case ActionTypes.REMOVE_GLOBAL_STYLE: {
      return fullState.styles[0].id;
    }
    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { currentStyleId } = action.payload;

      return currentStyleId || state;
    }
    case ActionTypes.REGENERATE_COLORS:
    case ActionTypes.REGENERATE_TYPOGRAPHY: {
      const regenerateStylesExist = getRegeneratedStyle(fullState.styles);

      if (regenerateStylesExist) {
        return regenerateStylesExist.id;
      }

      return action.payload.id;
    }
    default:
      return state;
  }
};
