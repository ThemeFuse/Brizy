import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Urls } from "visual/global/Config/types/Urls";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Ecwid } from "visual/global/Config/types/configs/modules/shop/Ecwid";
import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid/types";
import { CollectionItemId, CustomerId } from "visual/types";
import { WithId } from "visual/types/attributes";
import { Role } from "visual/utils/membership";
import { Module } from "../Module";
import { WhiteLabel } from "./WhiteLabel";
import { Shopify } from "./modules/shop/Shopify";

export type ShopModules = undefined | Ecwid | Shopify;

// region Page
interface BasePage<Id extends string> {
  id: Id;
  isProtected: boolean;
  isResetPassPage: boolean;
  slug?: string;
  collectionTypeSlug?: string;
}

// region CollectionPage
export interface CollectionPage extends BasePage<CollectionItemId> {
  provider: "collections";
}

export const isCollectionPage = (p: Page): p is CollectionPage =>
  p.provider === "collections";
// endregion

// region CustomerPage
export interface CustomerPage extends BasePage<CustomerId> {
  provider: "customers";
}

export const isCustomerPage = (p: Page): p is CustomerPage =>
  p.provider === "customers";
// endregion

// region EcwidProduct
export interface EcwidProduct extends BasePage<CollectionItemId> {
  provider: "ecwid-product";
  productId: EcwidProductId;
}

export const isEcwidProduct = (p: Page): p is EcwidProduct =>
  p && p.provider === "ecwid-product";
// endregion

// region EcwidCategory
export interface EcwidCategory extends BasePage<CollectionItemId> {
  provider: "ecwid-product-category";
  categoryId: EcwidCategoryId;
}

export const isEcwidCategory = (p: Page): p is EcwidCategory =>
  p && p.provider === "ecwid-product-category";
// endregion

export type Page = CollectionPage | CustomerPage | EcwidProduct | EcwidCategory;

// endregion

export interface Base<Platform> extends ConfigCommon, WithId<number> {
  availableRoles: Role[];
  page: Page;
  container: {
    id: number;
  };
  tokenV1?: string;
  tokenV2?: {
    token_type: string;
    access_token: string;
  };
  platform: Platform;
  dynamicContent?: DynamicContent<"cloud">;
  urls: Urls<"cloud">;
  whiteLabel?: WhiteLabel;
  modules?: Module<"cloud">;
}

export const isEcwidShop = (shop: ShopModules): shop is Ecwid =>
  shop?.type === "ecwid";

export const isShopifyShop = (shop: ShopModules): shop is Shopify =>
  shop?.type === "shopify";
