import { Dictionary } from "visual/types/utils";

//#region common

export type Attributes = { [k: string]: AttributeValue };

export type AttributeValue =
  | undefined
  | null
  | string
  | number
  | AttributeValueObject;

export type AttributeValueObject = {
  [k: string]: AttributeValueObjectValue;
};

export type AttributeValueObjectValue =
  | undefined
  | null
  | string
  | string[]
  | number
  | number[]
  | AttributeValueObject;

type V_ = {
  type: string;
  gridRow: number;
  gridColumn: number;
  source: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string>;
  [k: string]: unknown; // this is done to cover when symbols are being added to v
};
export type V = { [K in keyof V_]?: V_[K] | null };

export type VDecoded = {
  type: string;
  gridRow: number;
  gridColumn: number;
  source: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string[]>;
};

//#endregion

//#region cloud

export type CloudQuery = CloudPostsQuery | CloudArchiveQuery;

export type CloudPostsQuery = {
  type: "posts";
  collection_type: string;
  include: Dictionary<string[]>;
  exclude: Dictionary<string[]>;
  count: number;
  order_by: "id" | "title" | "random";
  order: "ASC" | "DESC";
  offset: number;
};

export type CloudArchiveQuery = {
  type: "archive";
  count: number;
  order_by: "id" | "title" | "random";
  order: "ASC" | "DESC";
};

//#endregion

//#region wp

export type WPQuery = WPPostsQuery | WPArchiveQuery;

export type WPPostsQuery = {
  query: WPQueryArgs;
};

export type WPArchiveQuery = {
  count: number;
  orderby: string;
  order: "ASC" | "DESC";
};

export type WPQueryArgs = {
  post_status: string;
  post_type: string;
  post__in?: string[];
  post__not_in?: string[];
  author__in?: string[];
  author__not_in?: string[];
  tax_query?: WPTaxQuery;
  offset?: number;
  date_query?:
    | [
        {
          after: string;
        }
      ]
    | [
        {
          after: string;
          before: string;
        }
      ];
  orderby?: string;
  order?: string;
  posts_per_page?: number;
  ignore_sticky_posts?: 1;
};

export type WPTaxQuery = {
  relation: "OR" | "AND";
  [k: number]: WPTaxQueryItem | WPTaxQuery;
};

export type WPTaxQueryItem = {
  taxonomy: string;
  field: "id";
  terms: string;
  operator?: "IN" | "NOT IN";
};

//#endregion
