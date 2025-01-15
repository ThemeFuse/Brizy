import { isCloud } from "visual/global/Config/types";
import { isShopify } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { MValue } from "visual/utils/value";

export enum ShopifyTemplate {
  Product = "shopify-product",
  Page = "shopify-page",
  Collection = "shopify-collection",
  Article = "shopify-article",
  Blog = "shopify-blog"
}

export const isShopifyTemplate = (s: string): s is ShopifyTemplate =>
  Object.values(ShopifyTemplate).includes(s as ShopifyTemplate);

export const getShopifyTemplate = (
  config: ConfigCommon
): MValue<ShopifyTemplate> =>
  isCloud(config) &&
  isShopify(config) &&
  isShopifyTemplate(config.templateType.type)
    ? config.templateType.type
    : undefined;
