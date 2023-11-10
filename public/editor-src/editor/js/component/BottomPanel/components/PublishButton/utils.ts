import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { StoreChanged } from "visual/redux/types";
import { Page } from "visual/types";
import { t } from "visual/utils/i18n";

export const getTooltipPageTitle = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return t("Switch to Draft");
    }
    case "draft": {
      return t("Publish Page");
    }
  }
};

export const getTooltipPageIcon = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return "nc-switch";
    }
    case "draft": {
      return "nc-publish";
    }
  }
};

export const getButtonLabel = (
  store: StoreChanged,
  status: Page["status"]
): string => {
  switch (store) {
    case StoreChanged.changed: {
      switch (status) {
        case "draft":
        case "publish": {
          return t("Save");
        }
      }
    }
    //@eslint-disable-next-line: ESLint: Expected a 'break' statement before 'case'.(no-fallthrough)
    case StoreChanged.pending: {
      return t("Saving");
    }
    case StoreChanged.unchanged: {
      switch (status) {
        case "draft": {
          return t("Save Draft");
        }
        case "publish": {
          return t("Publish");
        }
      }
    }
  }
};

export const getMode = (
  config: Shopify
): "withRules" | "withTemplate" | "withArticle" | undefined => {
  switch (config.templateType.type) {
    case ShopifyTemplate.Collection:
    case ShopifyTemplate.Product: {
      return "withRules";
    }
    case ShopifyTemplate.Blog:
    case ShopifyTemplate.Article: {
      return "withArticle";
    }
    case ShopifyTemplate.Page: {
      return "withTemplate";
    }
  }
};
