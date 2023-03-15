import { XAuthUserToken } from "visual/component/LeftSidebar/components/Cms/types/XAuth";
import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Subscription } from "visual/global/Config/types/shopify/Subscription";
import {
  EcwidCategoryPage,
  EcwidProductPage,
  Page,
  PageCollection,
  PageCustomer,
  ShopifyPage
} from "visual/types";
import { Language } from "visual/utils/multilanguages";
import { TemplateType } from "../TemplateType";
import { ShopifyTemplate } from "../shopify/ShopifyTemplate";
import { Base, CollectionPage } from "./Base";

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
  templates: { id: string }[];
  templateType: {
    id: string;
    type: ShopifyTemplate;
  };
  subscription: Subscription;
}

export const isShopify = (c: Cloud): c is Shopify => c.platform === "shopify";
//#endregion

//#region Provider
export const isCustomer = (c: CMS): boolean => c.page.provider === "customers";

export const isCollection = (c: CMS): boolean =>
  c.page.provider === "collections";
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

export const isShopifyPage = (page: Page): page is ShopifyPage => {
  const config = Config.getAll();
  return isCloud(config) && isShopify(config) && !("rules" in page);
};

export const isCustomerPage = (page: Page): page is PageCustomer => {
  return "groups" in page;
};
//#endregion
