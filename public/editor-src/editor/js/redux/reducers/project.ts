import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";
import {
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_CURRENT_KIT_ID,
  DELETE_FONTS,
  IMPORT_KIT,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE
} from "../actions";

type ProjectVersion = ReduxState["projectVersion"];
type RProjectVersion = (
  s: ProjectVersion,
  a: ReduxAction,
  allS: ReduxState
) => ProjectVersion;

export const projectVersion: RProjectVersion = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { projectVersion } = action.payload;

      return projectVersion;
    }
    case "UPDATE_EXTRA_FONT_STYLES":
    case "ADD_FONTS":
    case "IMPORT_STORY":
    case "IMPORT_TEMPLATE": // @ts-expect-error
    case IMPORT_KIT: // @ts-expect-error
    case DELETE_FONTS: // @ts-expect-error
    case UPDATE_CURRENT_KIT_ID: // @ts-expect-error
    case UPDATE_DISABLED_ELEMENTS: // @ts-expect-error
    case UPDATE_CURRENT_STYLE_ID: // @ts-expect-error
    case UPDATE_CURRENT_STYLE: {
      return state + 1;
    }
    case "PUBLISH": {
      if (state !== fullState.project.dataVersion) {
        return fullState.project.dataVersion + 1;
      }

      return state;
    }
    default:
      return state;
  }
};
