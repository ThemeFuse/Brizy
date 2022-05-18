import Config from "visual/global/Config";
import { Config as Config_ } from "visual/global/Config/types";
import { Page, PageCollection, PageCustomer, ShopifyPage } from "visual/types";
import { TemplateType } from "../TemplateType";
import { Subscription } from "visual/global/Config/types/shopify/Subscription";
import { ShopifyTemplate } from "../shopify/ShopifyTemplate";
import { Language } from "visual/utils/multilanguages";
import { Base } from "./Base";

//#region CMS
export interface CMS extends Base<"cms"> {
  templateType?: TemplateType;
  availableTranslations: Language[];
}

export const isCMS = (c: Cloud): c is CMS => c.platform === "cms";
//#endregion

//#region Shopify
export interface Shopify extends Base<"shopify"> {
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
export const isCloud = (config: Config_): config is Cloud =>
  TARGET === "Cloud" || TARGET === "Cloud-localhost";

//#region Page
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
