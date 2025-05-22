import { arrayMove } from "@dnd-kit/sortable";
import {
  Actions,
  AddableActions,
  AddableState,
  SidebarAlignment
} from "./types";
import { setSidebarAlignment } from "./utils";

export function itemsReducer(
  state: AddableState,
  action: Actions
): AddableState {
  switch (action.type) {
    case AddableActions.REMOVE: {
      const { groupId } = action.payload;

      return {
        ...state,
        optionGroups: state.optionGroups.filter(({ id }) => id !== groupId)
      };
    }

    case AddableActions.REORDER: {
      const { oldIndex, newIndex } = action.payload;

      return {
        ...state,
        optionGroups: arrayMove(state.optionGroups, oldIndex, newIndex),
        activeGroup: null
      };
    }

    case AddableActions.SET_OPTION_GROUPS: {
      return { ...state, optionGroups: action.payload.optionGroups };
    }

    case AddableActions.TOGGLE_SIDEBAR: {
      return {
        ...state,
        sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen }
      };
    }

    case AddableActions.TOGGLE_SIDEBAR_ALIGNMENT: {
      const alignment =
        state.sidebar.alignment === SidebarAlignment.left
          ? SidebarAlignment.right
          : SidebarAlignment.left;
      setSidebarAlignment(alignment);

      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          alignment: alignment
        }
      };
    }

    case AddableActions.SET_ACTIVE_GROUP: {
      return {
        ...state,
        activeGroup: {
          groupId: action.payload.groupId,
          isOpen: action.payload.isOpen
        }
      };
    }

    case AddableActions.SET_GROUP_TITLE: {
      return {
        ...state,
        optionGroups: state.optionGroups.map((group) => {
          if (group.id !== action.payload.groupId) {
            return group;
          }

          return { ...group, title: action.payload.title };
        })
      };
    }

    case AddableActions.CLOSE_SIDEBAR: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: false
        }
      };
    }

    default: {
      return state;
    }
  }
}
