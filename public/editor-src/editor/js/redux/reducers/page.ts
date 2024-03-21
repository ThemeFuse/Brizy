import { produce } from "immer";
import { fromJS } from "immutable";
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
      const popup = isPopup(Config.getAll());
      const _page = popup
        ? pageAssembledSelector(fullState)
        : pageAssembledRawSelector(fullState);
      const newPage = produce<Page>(_page, (draft) => {
        draft.status = status;
      });

      const oldState = fromJS(state);
      const newState = fromJS(newPage);

      if (oldState.equals(newState)) {
        return state;
      }

      return produce<Page>(newPage, (draft) => {
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
    case "UPDATE_PAGE_IS_HOME_PAGE": {
      if (isShopifyPage(state)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.layout.isHomePage = action.payload.isHomePage;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    default:
      return state;
  }
};
