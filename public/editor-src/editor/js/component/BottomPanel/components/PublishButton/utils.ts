import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { StoreChanged } from "visual/redux/types";
import { Page } from "visual/types";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";

type Mode = "withRules" | "withTemplate" | "withArticle";

export const getTooltipPageTitle = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return t("Switch to Draft");
    }
    case "draft":
    case "future": {
      return t("Publish Page");
    }
  }
};

export const getTooltipPageIcon = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return "nc-switch";
    }
    case "draft":
    case "future": {
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
        case "publish":
        case "future": {
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
        case "draft":
        case "future": {
          return t("Save Draft");
        }
        case "publish": {
          return t("Publish");
        }
      }
    }
  }
};

export const getMode = (config: Shopify): MValue<Mode> => {
  switch (config.templateType.type) {
    case ShopifyTemplate.Collection:
    case ShopifyTemplate.Product:
    case ShopifyTemplate.Blog: {
      return "withRules";
    }
    case ShopifyTemplate.Article: {
      return "withArticle";
    }
    case ShopifyTemplate.Page: {
      return "withTemplate";
    }
  }
};

export const isTemplateOrRulesMode = (mode: unknown): mode is Mode =>
  mode === "withRules" || mode === "withTemplate" || mode === "withArticle";
