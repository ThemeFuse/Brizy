import { Arr, Str } from "@brizy/readers";
import { RulesState as PageArticleRulesState } from "visual/component/Prompts/PromptPageArticle/types";
import {
  Item,
  RulesState as PageRulesState,
  Valid
} from "visual/component/Prompts/PromptPageRules/types";
import {
  Tabs,
  ThemeLayout,
  getTabs,
  readLayout
} from "visual/component/Prompts/common/PromptPage/types";
import { Shopify } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { Layout } from "visual/types/Layout";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";

export const getChoices = (templates: Shopify["templates"]): ThemeLayout[] =>
  templates.reduce<ThemeLayout[]>((acc, { id, title }) => {
    const _id = readLayout(id);
    if (_id) {
      acc.push({ id: _id, title });
    }
    return acc;
  }, []);

export const getTabsByItemsNumber = (
  state: PageRulesState | PageArticleRulesState
) => {
  const items = Arr.read((state.payload as Valid)?.items);

  if (!items) {
    return getTabs();
  }

  if (!items.length) {
    return getTabs().filter((tab) => tab.id === Tabs.settings);
  }

  return getTabs();
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

export const getAllOptionText = (type: ShopifyTemplate): string => {
  switch (type) {
    case ShopifyTemplate.Collection:
      return t("All collections");
    case ShopifyTemplate.Product:
      return t("All products");
    case ShopifyTemplate.Blog:
      return t("All blogs");
  }

  return t("All products");
};

export const getPromptPageRulesHeadTitle = (
  type: MValue<ShopifyTemplate>
): string => {
  switch (type) {
    case ShopifyTemplate.Product:
      return t("WHICH PRODUCTS WILL USE THIS TEMPLATE ?");
    case ShopifyTemplate.Collection:
      return t("WHICH COLLECTIONS WILL USE THIS TEMPLATE ?");
  }

  return t("SELECT FOR WHAT THE TEMPLATE IS USED");
};

export const getPromptPageArticleHeadTitle = (
  type: MValue<ShopifyTemplate>
): string => {
  switch (type) {
    case ShopifyTemplate.Article:
      return t("YOUR BLOG POST IS READY TO BE PUBLISHED");
    case ShopifyTemplate.Blog:
      return t("WHICH BLOG WILL USE THIS TEMPLATE ?");
  }

  return t("YOUR PAGE IS READY TO PUBLISH!");
};

export const isAllChecked = (items: Item[]): boolean =>
  items.every((item) => item.selected);

export const getRulesId = (rules: Record<string, boolean>): string[] =>
  Object.entries(rules)
    .filter(([, v]) => v)
    .map(([k]) => k);

export const canSyncPage = (config: ConfigCommon): boolean => {
  const currentPublishedPagesCount = Str.read(
    config?.modules?.shop?.upgradeToProUrl
  );

  return !currentPublishedPagesCount;
};

export const getShopifyLayout = (layouts: ThemeLayout[]): MValue<ThemeLayout> =>
  layouts.find((layout) => layout.id === Layout.Shopify);

export const isShopifyLayout = (layout: Layout): layout is Layout.Shopify =>
  layout === Layout.Shopify;
