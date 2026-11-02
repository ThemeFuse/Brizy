import type { MenuData } from "visual/global/Config/types/configs/ConfigCommon";
import { ActionTypes, type ReduxAction } from "../actions2";
import type { ReduxState } from "../types";

type RMenuData = (s: ReduxState["menuData"], a: ReduxAction) => MenuData[];

// Menus come from the config on hydrate, exactly like `projectData`.
// Everything downstream (Menu, MenuSimple, attachMenu, the ai tools) reads them
// from here, so a menu created or deleted mid-session re-renders the editor
// instead of relying on a mutation of the config object.
export const menuData: RMenuData = (state = [], action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { config } = action.payload;

      return config.menuData ?? [];
    }
    case ActionTypes.ADD_MENU_DATA: {
      return [...state, action.payload];
    }
    case ActionTypes.UPDATE_MENU_DATA: {
      const { id, items } = action.payload;

      if (!state.some((menu) => menu.id === id)) {
        return state;
      }

      return state.map((menu) => (menu.id === id ? { ...menu, items } : menu));
    }
    case ActionTypes.REMOVE_MENU_DATA: {
      const { id } = action.payload;

      if (!state.some((menu) => menu.id === id)) {
        return state;
      }

      return state.filter((menu) => menu.id !== id);
    }
    default:
      return state;
  }
};
