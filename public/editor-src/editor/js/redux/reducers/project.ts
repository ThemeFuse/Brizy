import produce from "immer";
import { fromJS } from "immutable";
import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";
import { projectAssembled } from "visual/redux/selectors";

type Project = ReduxState["project"];
type RProject = (s: Project, a: ReduxAction, f: ReduxState) => Project;

export const project: RProject = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;

      return project;
    }
    case "PUBLISH": {
      const oldState = fromJS(state);
      const newState = fromJS(projectAssembled(fullState));

      // @ts-expect-error: Immutable js is return unknown for fromJS fn
      if (oldState.equals(newState)) {
        return state;
      }

      return produce(projectAssembled(fullState), draft => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_DISABLED_ELEMENTS": {
      const disabledElements = action.payload;

      return produce(state, draft => {
        draft.data.disabledElements = disabledElements;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "IMPORT_KIT": {
      const { selectedKit } = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_CURRENT_KIT_ID": {
      const selectedKit = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "IMPORT_STORY":
    case "IMPORT_TEMPLATE": {
      const { styles, fonts } = action.payload;

      if (styles?.length || fonts?.length) {
        return produce(state, draft => {
          draft.dataVersion = draft.dataVersion + 1;
        });
      }

      return state;
    }
    case "ADD_FONTS":
    case "DELETE_FONTS": {
      return produce(state, draft => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_DEFAULT_FONT": {
      const font = action.payload;

      return produce(state, draft => {
        draft.data.font = font;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }

    default:
      return state;
  }
};
