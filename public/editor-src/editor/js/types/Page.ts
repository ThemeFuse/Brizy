import { GetCollectionItem_collectionItem as CollectionItem } from "visual/global/Config/types/GetCollectionItem";
import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid/types";
import { Block, BlockHtml } from "./Block";
import { Layout } from "./Layout";
import { Rule } from "./Rule";

//#region Page

export interface DataCommon {
  id: string;
  matchingItemId?: string;
  data: {
    items: Block[];
    [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  dataVersion: number;
  status: "draft" | "publish" | "future" | "private"; // The future status is used for scheduled pages .
  dependencies: Array<string>;
  blocks?: Array<BlockHtml & { id: string }>;
}

interface DataWithTitle extends DataCommon {
  title: string;
}

export interface PageCommon extends DataWithTitle {
  slug: string;
}

export interface PageWP extends PageCommon {
  _kind: "wp";
  is_index: boolean; // TODO: would be nice if WP and cloud types would match
  template: string;
}

export interface InternalPopupCloud extends DataWithTitle {
  rules: Rule[];
  project: number;
}

export interface PageCollection extends PageCommon {
  collectionType: {
    id: string;
    title: string;
  };
  fields: CollectionItem["fields"] | null;
}

export interface CloudPopup extends PageCollection {
  rules: Rule[];
}

export type ExternalPopupCloud = DataCommon;

export interface ShopifyPage extends PageCommon {
  layout: {
    id: string;
    value: Layout | undefined;
    isHomePage: string | null;
  };
}

export interface EcwidProductPage extends DataWithTitle {
  __type: "ecwid-product";
  productId: EcwidProductId;
}

export interface EcwidCategoryPage extends DataWithTitle {
  __type: "ecwid-product-category";
  categoryId: EcwidCategoryId;
}

export type Page =
  | PageWP
  | PageCollection
  | ShopifyPage
  | EcwidProductPage
  | EcwidCategoryPage
  | InternalPopupCloud
  | ExternalPopupCloud
  | CloudPopup;

//#endregion
