import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";

type CurrentStyleId = ReduxState["currentStyleId"];
type RCurrentStyleId = (
  s: CurrentStyleId,
  a: ReduxAction,
  f: ReduxState
) => CurrentStyleId;

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
    default:
      return state;
  }
};
