import { produce } from "immer";
import { isShopifyPage } from "visual/global/Config/types/configs/Cloud";
import { isPopup } from "visual/providers/EditorModeProvider";
import {
  middleGlobalBlocksIdSelector,
  pageAssembledRawSelector,
  pageAssembledSelector,
  popupBlocksInPageSelector,
  storeWasChangedSelector
} from "visual/redux/selectors";
import { ShopifyPage } from "visual/types/Page";
import { ReduxAction } from "../actions2";
import { ReduxState, StoreChanged } from "../types";

type Page = ReduxState["page"];
type RPage = (s: Page, a: ReduxAction, f: ReduxState) => Page;

export const page: RPage = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { page, config } = action.payload;

      return produce(page, (draft) => {
        draft.data.editorVersion = config.editorVersion;
      });
    }
    case "PUBLISH": {
      const { status, editorMode } = action.payload;
      const storeWasChanged = storeWasChangedSelector(fullState);

      if (storeWasChanged !== StoreChanged.changed && status === state.status) {
        return state;
      }

      const page = isPopup(editorMode)
        ? pageAssembledSelector(fullState)
        : pageAssembledRawSelector(fullState);

      // Create globalBlocks Dependencies
      const globalPopupsDeps: Array<string> = popupBlocksInPageSelector(
        fullState
      ).map((p) => p.value._id);
      const globalBlocksDeps = middleGlobalBlocksIdSelector(fullState);
      const dependencies = [...globalPopupsDeps, ...globalBlocksDeps];

      return produce<Page>(page, (draft) => {
        draft.status = status;
        draft.dependencies = dependencies;
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
      const { layout, config } = action.payload;

      if (isShopifyPage(state, config)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.layout.value = layout;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    case "UPDATE_PAGE_TITLE": {
      const { title, config } = action.payload;

      if (isShopifyPage(state, config)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.title = title;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    case "UPDATE_PAGE_IS_HOME_PAGE": {
      const { isHomePage, config } = action.payload;

      if (isShopifyPage(state, config)) {
        return produce<ShopifyPage>(state, (draft) => {
          draft.layout.isHomePage = isHomePage;
          draft.dataVersion = draft.dataVersion + 1;
        });
      }
      return state;
    }
    default:
      return state;
  }
};
