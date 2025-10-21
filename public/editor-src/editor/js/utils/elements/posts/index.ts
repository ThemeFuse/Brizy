import { ElementModel } from "visual/component/Elements/Types";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { Dictionary } from "visual/types/utils";
import * as Obj from "visual/utils/reader/object";
import * as Union from "visual/utils/reader/union";
import { ECWID_CATEGORY_TYPE, ECWID_PRODUCT_TYPE } from "../../ecwid";
import { t } from "../../i18n";
import {
  CloudArchiveQuery,
  CloudPostsQuery,
  GetManualTitle,
  QueryArgs
} from "./types";
import {
  CURRENT_CONTEXT_TYPE,
  ORDER_BY_FIELD,
  readSymbol
} from "./utils.common";

export const createFieldCollectionId = (
  collectionId: string,
  fieldId?: string
): string => {
  return fieldId ? `${collectionId}:${fieldId}` : collectionId;
};

export const getManualTitle: GetManualTitle = ({ type, isManualSource }) => {
  switch (type) {
    case "shopify-product":
      return t("Products");
    case "shopify-collection":
      return t("Collections");
    case "shopify-article":
      return t("Posts");
    case ECWID_PRODUCT_TYPE: {
      if (isManualSource) {
        return t("Products");
      } else {
        return t("Manual");
      }
    }
    case ECWID_CATEGORY_TYPE: {
      if (isManualSource) {
        return t("Categories");
      } else {
        return t("Manual");
      }
    }
    default:
      return t("Manual");
  }
};

export const useAsSimpleSelectConditions = (vd: ElementModel): boolean => {
  const { source, symbols } = vd;
  const lvl1SymbolId = `${source}_incBy`;

  const _symbols = Obj.readWithValueReader(readSymbol)(symbols) ?? {};

  return (
    (source === ShopifyTemplate.Product &&
      !_symbols[lvl1SymbolId]?.includes("manual")) ||
    source === ShopifyTemplate.Article
  );
};

export function archiveQuery(data: QueryArgs): CloudArchiveQuery {
  const { count, orderBy, order, offset, field } = data;

  return {
    type: "archive",
    count,
    order_by:
      Union.readWithChoices<CloudArchiveQuery["order_by"]>([
        "id",
        "random",
        "title",
        "publishDate",
        ORDER_BY_FIELD
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudArchiveQuery["order"]>(["ASC", "DESC"])(
        order
      ) ?? "DESC",
    offset,
    ...(field ? { field } : {})
  };
}

export function postsQuery(v: QueryArgs): CloudPostsQuery {
  const {
    source,
    querySource,
    count,
    offset,
    orderBy,
    order,
    symbols,
    excludeCurrentProduct,
    component,
    field
  } = v;

  const includeSymbols = symbols[`${source}_incBy`];
  const include = includeSymbols
    ? includeExcludeAttribute(symbols, "inc", source, includeSymbols)
    : {};
  const isCurrentContext = source === CURRENT_CONTEXT_TYPE;

  const excludeSymbols = symbols[`${source}_excBy`];
  const exclude = excludeSymbols
    ? includeExcludeAttribute(symbols, "exc", source, excludeSymbols)
    : {};

  return {
    type: "posts",
    collection_type: source,
    collection_type_query: isCurrentContext ? querySource : undefined,
    include,
    exclude,
    count,
    order_by:
      Union.readWithChoices<CloudPostsQuery["order_by"]>([
        "id",
        "random",
        "title",
        "publishDate",
        ORDER_BY_FIELD
      ])(orderBy) ?? "id",
    order:
      Union.readWithChoices<CloudPostsQuery["order"]>(["ASC", "DESC"])(order) ??
      "DESC",
    offset,
    ...(excludeCurrentProduct === "on" ? { excludeCurrentProduct: 1 } : {}),
    ...(component ? { component } : {}),
    ...(field ? { field } : {})
  };
}

const includeExcludeAttribute: (
  symbols: Dictionary<string[]>,
  prefix: string,
  lvl1Id: string,
  arr: string[]
) => Dictionary<Array<{ collectionId: string; fieldId?: string }>> = (
  symbols,
  prefix,
  lvl1Id,
  arr
) =>
  arr.reduce<Dictionary<Array<{ collectionId: string; fieldId?: string }>>>(
    (acc, id) => {
      const lvl2Id = `${lvl1Id}_${prefix}_${id}`;
      const lvl2Symbol = symbols[lvl2Id];

      if (lvl2Symbol !== undefined) {
        const { collectionId } = getFieldIdCollectionId(id);
        acc[collectionId] = lvl2Symbol.map(getFieldIdCollectionId);
      }

      return acc;
    },
    {}
  );

export const getFieldIdCollectionId = (
  s: string
): { collectionId: string; fieldId?: string } => {
  const [collectionId, fieldId] = s.split(":");

  return fieldId ? { collectionId, fieldId } : { collectionId };
};

export * from "./utils.common";
