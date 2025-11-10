import { ReduxAction } from "../actions2";
import { ReduxState } from "../types";

type UIState = ReduxState["ui"];

const defaultState: UIState = {
  deviceMode: "desktop",
  activeElement: null,
  leftSidebar: {
    drawerContentType: null
  },
  rightSidebar: {
    type: "options",
    isOpen: false,
    lock: undefined,
    alignment: "right",
    activeTab: undefined,
    expanded: false
  },
  showHiddenElements: false,
  currentRole: "default",
  currentLanguage: "default"
};

export function ui(
  state: UIState = defaultState,
  action: ReduxAction
): UIState {
  switch (action.type) {
    case "UPDATE_UI": {
      const { key, value } = action;
      const newState = {
        ...state,
        [key]: value
      };

      // deviceMode + rightSidebar
      if (key === "deviceMode" && newState.rightSidebar.lock !== "manual") {
        if (value !== "desktop") {
          newState.rightSidebar = {
            ...newState.rightSidebar,
            isOpen: true,
            lock: "auto"
          };
        } else {
          if (newState.rightSidebar.isOpen) {
            newState.rightSidebar = {
              ...newState.rightSidebar,
              isOpen: false,
              lock: undefined
            };
          }
        }
      }

      return newState;
    }
    default:
      return state;
  }
}
