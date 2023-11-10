import { RulesState as PageArticleRulesState } from "visual/component/Prompts/PromptPageArticle/types";
import {
  RulesState as PageRulesState,
  Valid
} from "visual/component/Prompts/PromptPageRules/types";
import {
  Layout,
  Tabs,
  tabs
} from "visual/component/Prompts/common/PromptPage/types";
import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { t } from "visual/utils/i18n";
import * as Arr from "visual/utils/reader/array";

export const getChoices = (config: Shopify): Layout[] =>
  config.templates.map(({ id, title }) => ({
    id,
    title
  }));

export const getTabsByItemsNumber = (
  state: PageRulesState | PageArticleRulesState
) => {
  const items = Arr.read((state.payload as Valid)?.items);

  if (!items) {
    return tabs;
  }

  if (!items.length) {
    return tabs.filter((tab) => tab.id === Tabs.page);
  }

  return tabs;
};

export const getHeadingText = (type: ShopifyTemplate): string => {
  switch (type) {
    case ShopifyTemplate.Product:
      return t("No products yet!");
    case ShopifyTemplate.Collection:
      return t("No collections yet!");
    case ShopifyTemplate.Blog:
    case ShopifyTemplate.Article:
      return t("No blogs yet!");
  }

  return t(`No products yet!`);
};

export const getContentText = (type: ShopifyTemplate): string => {
  switch (type) {
    case ShopifyTemplate.Product:
      return t(
        `In order to view and select them in this screen, please add products to your shop.`
      );
    case ShopifyTemplate.Collection:
      return t(
        `In order to view and select them in this screen, please add collections to your shop.`
      );
    case ShopifyTemplate.Article:
    case ShopifyTemplate.Blog:
      return t(
        `In order to view and select them in this screen, please add blogs to your shop.`
      );
  }

  return t(
    `In order to view and select them in this screen, please add products to your shop.`
  );
};

export const getLinkText = (type: ShopifyTemplate): string => {
  switch (type) {
    case ShopifyTemplate.Product:
      return t("Add Products in Shopify");
    case ShopifyTemplate.Collection:
      return t("Add Collections in Shopify");
    case ShopifyTemplate.Article:
    case ShopifyTemplate.Blog:
      return t("Add Blogs in Shopify");
  }

  return t("Add Products in Shopify");
};
