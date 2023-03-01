import produce from "immer";
import Config from "visual/global/Config";
import { isShopifyPage } from "visual/global/Config/types/configs/Cloud";
import {
  pageAssembledRawSelector,
  pageAssembledSelector
} from "visual/redux/selectors";
import { ShopifyPage } from "visual/types";
import { isPopup } from "visual/utils/models";
import { ReduxAction } from "../actions2";
import { ReduxState } from "../types";

type Page = ReduxState["page"];
type RPage = (s: Page, a: ReduxAction, f: ReduxState) => Page;

export const page: RPage = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { page } = action.payload;

      return page;
    }
    case "PUBLISH": {
      const { status } = action.payload;

      const page = isPopup(Config.getAll())
        ? pageAssembledSelector(fullState)
        : pageAssembledRawSelector(fullState);

      return produce<Page>(page, (draft) => {
        draft.status = status;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_TRIGGERS": {
      const { data: triggers } = action.payload;

      return produce<Page>(state, (draft) => {
        draft.data.triggers = triggers;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_POPUP_RULES": {
      return produce<Page>(state, (draft) => {
        draft.data.rulesAmount = action.payload.rules.length;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_PAGE_LAYOUT": {
      if (isShopifyPage(state)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.layout.value = action.payload.layout;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    case "UPDATE_PAGE_TITLE": {
      if (isShopifyPage(state)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.title = action.payload;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    default:
      return state;
  }
};
