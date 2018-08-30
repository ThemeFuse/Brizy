import _ from "underscore";
import { combineReducers } from "redux";
import historyEnhancer from "./historyEnhancer";
import {
  HYDRATE,
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  UPDATE_UI
} from "../actionTypes";

// page
export function page(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      return action.page;
    case UPDATE_PAGE:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

// globals

export function globals(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      const globals = action.globals;
      const project = globals.project;

      // code needed to migrate font styles
      // that were added by the user
      // into a separate key so that they can be
      // reused between styles
      if (project.styles && project.styles.default) {
        const [extraFontStyles, clearedFontStyles] = _.partition(
          project.styles.default.fontStyles,
          fs => fs.deletable === "on"
        );

        if (extraFontStyles.length > 0) {
          const styles = {
            ...project.styles,
            _extraFontStyles: extraFontStyles,
            default: {
              ...project.styles.default,
              fontStyles: clearedFontStyles
            }
          };

          return {
            ...globals,
            project: {
              ...project,
              styles
            }
          };
        }
      }

      return globals;
    case UPDATE_GLOBALS:
      return {
        ...state,
        [action.projectOrLanguage]: {
          ...state[action.projectOrLanguage],
          [action.key]: action.value
        }
      };
    default:
      return state;
  }
}

// ui

const uiDefault = {
  deviceMode: "desktop",
  leftSidebar: {
    isOpen: false,
    drawerContentType: null
  }
};
export function ui(state = uiDefault, action) {
  switch (action.type) {
    case UPDATE_UI:
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}

export default historyEnhancer(
  combineReducers({
    page,
    globals,
    ui
  }),
  ["page", "globals"]
);
