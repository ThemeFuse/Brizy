import { HYDRATE } from "visual/redux/actions";
import { ActionTypes, ReduxAction as Actions } from "../actions2";
import { ReduxState } from "../types";
import { produce } from "immer";

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

      const doesStyleExists = state.find((item) => item.id === styles[0].id);
      if (doesStyleExists) {
        return state;
      }

      return [...styles, ...state];
    }
    case ActionTypes.UPDATE_CURRENT_STYLE: {
      return produce(state, (draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (draft[i].id === action.payload.id) {
            draft[i] = action.payload;
          }
        }
      });
    }
    default:
      return state;
  }
};
