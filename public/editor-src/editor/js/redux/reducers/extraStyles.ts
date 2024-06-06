import { produce } from "immer";
import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";

type ExtraStyles = ReduxState["extraStyles"];
type RExtraStyles = (
  s: ExtraStyles,
  a: ReduxAction,
  f: ReduxState
) => ExtraStyles;

export const extraStyles: RExtraStyles = (state = [], action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;

      return project.data.extraStyles;
    }
    case ActionTypes.UPDATE_CURRENT_STYLE: {
      const activeStyleId = fullState.currentStyleId;

      return produce(state, (draft) => {
        const activeStyleIndex = draft.findIndex(
          (style) => style.id === activeStyleId
        );

        if (activeStyleIndex !== -1) {
          draft[activeStyleIndex] = action.payload;
        }
      });
    }
    case ActionTypes.ADD_NEW_GLOBAL_STYLE: {
      return [...state, action.payload];
    }
    case ActionTypes.REMOVE_GLOBAL_STYLE: {
      return state.filter((style) => style.id !== action.payload);
    }
    case ActionTypes.EDIT_GLOBAL_STYLE_NAME: {
      const activeStyleId = fullState.currentStyleId;

      return produce(state, (draft) => {
        const activeStyleIndex = draft.findIndex(
          (style) => style.id === activeStyleId
        );
        if (activeStyleIndex !== -1) {
          draft[activeStyleIndex].title = action.payload;
        }
      });
    }
    default:
      return state;
  }
};
