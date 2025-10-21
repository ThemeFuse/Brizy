import { Choice } from "visual/component/Options/types/dev/Select/types";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { Switch } from "visual/types/Options";
import { Dictionary } from "visual/types/utils";

export type GetManualTitle = (data: {
  type?: string;
  isManualSource?: boolean;
}) => string;

export type RefsById = Dictionary<
  {
    type: "single" | "multi" | "manual";
    id: string;
    fieldId: string;
    title: string;
  }[]
>;

export interface ToolbarContext {
  collectionTypesInfo: {
    sources: Sources[];
    refsById: RefsById;
  };
}

export type Context = EditorComponentContextValue & ToolbarContext;

export interface Sources {
  id: string;
  title: string;
  orderBy: { id: string; title: string }[];
  fields?: Choice[];
}

export type PostsTypes =
  | "posts"
  | "archives"
  | "products"
  | "archives-product"
  | "upsell";

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

type OrderBy = "id" | "title" | "random" | "publishDate" | "field";

//#region cloud
export interface CloudPostsQuery {
  type: "posts";
  collection_type: string;
  collection_type_query: string | undefined;
  include: Dictionary<Array<{ collectionId: string; fieldId?: string }>>;
  exclude: Dictionary<Array<{ collectionId: string; fieldId?: string }>>;
  count: number;
  order_by: OrderBy;
  order: "ASC" | "DESC";
  offset: number;
  excludeCurrentProduct?: 1;
}

export interface CloudArchiveQuery {
  type: "archive";
  count: number;
  order_by: OrderBy;
  order: "ASC" | "DESC";
  offset: number;
  field?: string;
}

export type CloudQuery = CloudPostsQuery | CloudArchiveQuery;

export interface QueryArgs {
  type: string;
  count: number;
  source: string;
  querySource: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string[]>;
  component?: string;
  excludeCurrentProduct?: Switch;
  excludeCurrentProductOption?: boolean;
  field?: string;
}
//#endregion

//#region wp
export type WPQuery = WPPostsQuery | WPArchiveQuery;

export type WPPostsQuery = {
  query: WPQueryArgs;
  offset?: number;
};

export interface WPTagsQuery extends WPPostsQuery {
  allTag: string;
  tax: string;
  ulClassName: string;
  liClassName: string;
}

export type WPArchiveQuery = {
  count: number;
  orderby: string;
  order: "ASC" | "DESC";
  offset?: number;
};

export type WPQueryArgs = {
  post_status: string;
  post_type: string;
  post__in?: string[];
  post__not_in?: string[];
  author__in?: string[];
  author__not_in?: string[];
  tax_query?: WPTaxQuery;
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
  relation?: "OR" | "AND";
  [k: number]: WPTaxQueryItem | WPTaxQuery;
};

export type WPTaxQueryItem = {
  taxonomy: string;
  field: "term_id";
  terms: string;
  operator?: "IN" | "NOT IN";
};

//#endregion

export type Query = CloudQuery | WPQuery;
