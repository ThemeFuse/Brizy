export enum ShopifyTemplate {
  Product = "shopify-product",
  Page = "shopify-page",
  Collection = "shopify-collection",
  Article = "shopify-article"
}

export const isShopifyTemplate = (s: string): s is ShopifyTemplate =>
  Object.values(ShopifyTemplate).includes(s as ShopifyTemplate);
