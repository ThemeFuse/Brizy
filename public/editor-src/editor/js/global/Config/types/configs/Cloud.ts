import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Subscription } from "visual/global/Config/types/shopify/Subscription";
import {
  EcwidCategoryPage,
  EcwidProductPage,
  Page,
  PageCollection,
  ShopifyPage
} from "visual/types";
import { Language } from "visual/utils/multilanguages";
import { TemplateType } from "../TemplateType";
import { ShopifyTemplate } from "../shopify/ShopifyTemplate";
import { Base, CollectionPage } from "./Base";
import { XAuthUserToken } from "./XAuth";

//#region CMS

export interface CMS extends Base<"cms"> {
  templateType?: TemplateType;
  availableTranslations: Language[];
  x_auth_user_token?: XAuthUserToken;
}

export const isCMS = (c: Cloud): c is CMS => c.platform === "cms";

//#endregion

//#region Shopify

export interface Shopify extends Base<"shopify"> {
  page: CollectionPage;
  templates: { id: string; title: string }[];
  templateType: {
    id: string;
    type: ShopifyTemplate;
  };
  subscription: Subscription;
}

export const isShopify = (c: Cloud): c is Shopify => c.platform === "shopify";

//#endregion

export type Cloud = CMS | Shopify;

// @ts-expect-error: unused variable
export const isCloud = (config: ConfigCommon): config is Cloud =>
  TARGET === "Cloud" || TARGET === "Cloud-localhost";

//#region Page

export const isEcwidProductPage = (p: Page): p is EcwidProductPage => {
  return "__type" in p && p.__type === "ecwid-product";
};

export const isEcwidCategoryPage = (p: Page): p is EcwidCategoryPage => {
  return "__type" in p && p.__type === "ecwid-product-category";
};

export const isCollectionPage = (p: Page): p is PageCollection => {
  return "collectionType" in p;
};

export const isShopifyPage = (
  page: Page,
  config: ConfigCommon
): page is ShopifyPage => {
  return isCloud(config) && isShopify(config) && !("rules" in page);
};

//#endregion
