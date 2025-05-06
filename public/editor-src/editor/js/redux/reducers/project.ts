import { isEqual } from "es-toolkit";
import { produce } from "immer";
import { projectAssembled } from "visual/redux/selectors";
import { ActionTypes, ReduxAction } from "../actions2";
import { ReduxState } from "../types";

type Project = ReduxState["project"];
type RProject = (s: Project, a: ReduxAction, f: ReduxState) => Project;

export const project: RProject = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;

      return project;
    }
    case "PUBLISH": {
      const { type } = action.payload;
      const newProject = projectAssembled(fullState);

      if (type === "externalForce") {
        return produce(newProject, (draft) => {
          draft.dataVersion = draft.dataVersion + 1;
        });
      }

      if (isEqual(state, newProject)) {
        return state;
      }

      return produce(newProject, (draft) => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_DISABLED_ELEMENTS": {
      const disabledElements = action.payload;

      return produce(state, (draft) => {
        draft.data.disabledElements = disabledElements;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case ActionTypes.UPDATE_PINNED_ELEMENTS: {
      const pinnedElements = action.payload;

      return produce(state, (draft) => {
        draft.data.pinnedElements = pinnedElements;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case ActionTypes.IMPORT_KIT: {
      const { selectedKit } = action.payload;

      return produce(state, (draft) => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_CURRENT_KIT_ID": {
      const selectedKit = action.payload;

      return produce(state, (draft) => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { styles, fonts } = action.payload;

      if (styles?.length || fonts?.length) {
        return produce(state, (draft) => {
          draft.dataVersion = draft.dataVersion + 1;
        });
      }

      return state;
    }
    case "ADD_FONTS":
    case "DELETE_FONTS": {
      return produce(state, (draft) => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_DEFAULT_FONT": {
      const font = action.payload;

      return produce(state, (draft) => {
        draft.data.font = font;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }

    default:
      return state;
  }
};
