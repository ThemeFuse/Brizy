import produce from "immer";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import {
  pageAssembledRawSelector,
  pageAssembledSelector
} from "visual/redux/selectors";
import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";
import { isShopifyPage, ShopifyPage } from "visual/types";

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

      const page = IS_GLOBAL_POPUP
        ? pageAssembledSelector(fullState)
        : pageAssembledRawSelector(fullState);

      return produce<Page>(page, draft => {
        draft.status = status;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_TRIGGERS": {
      const { data: triggers } = action.payload;

      return produce<Page>(state, draft => {
        draft.data.triggers = triggers;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_POPUP_RULES": {
      return produce<Page>(state, draft => {
        draft.data.rulesAmount = action.payload.rules.length;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case "UPDATE_PAGE_LAYOUT": {
      if (isShopifyPage(state)) {
        return produce<ShopifyPage>(state, draft => {
          draft.layout.value = action.payload.layout;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    case "UPDATE_PAGE_TITLE": {
      if (isShopifyPage(state)) {
        return produce<ShopifyPage>(state, draft => {
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
