import { HYDRATE } from "visual/redux/actions";
import { ActionTypes, ReduxAction as Actions } from "../actions2";
import { ReduxState } from "../types";

type State = ReduxState["styles"];
type RStyles = (s: State, a: Actions, f: ReduxState) => State;

export const styles: RStyles = (state = [], action) => {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.styles;
    }
    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE:
    case ActionTypes.IMPORT_KIT: {
      const { styles } = action.payload;

      if (!styles) {
        return state;
      }

      return [...state, ...styles];
    }
    case ActionTypes.ADD_NEW_GLOBAL_STYLE: {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};
