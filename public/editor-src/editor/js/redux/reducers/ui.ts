import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";

type UIState = ReduxState["ui"];

const defaultState: UIState = {
  deviceMode: "desktop",
  leftSidebar: {
    isOpen: false,
    drawerContentType: undefined
  },
  rightSidebar: {
    isOpen: false,
    lock: undefined,
    alignment: "right"
  },
  showHiddenElements: false
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
