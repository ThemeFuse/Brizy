import { match, mPipe, parseStrict } from "fp-utilities";
import { PageCollection, PageCustomer } from "visual/types";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import {
  CollectionItemFieldInput,
  CollectionItemStatus
} from "visual/utils/api/cms/graphql/types/entities";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import { GetCustomer_customer as CustomerItem } from "visual/utils/api/cms/graphql/types/GetCustomer";
// eslint-disable-next-line @typescript-eslint/camelcase
import { CollectionItemFragment_fields_CollectionItemFieldText } from "./graphql/types/CollectionItemFragment";
import { pipe } from "visual/utils/fp";
import {
  Cloud,
  isCMS,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import Config from "visual/global/Config";
import { ShopifyPage } from "visual/types";

export const itemStatusToPageStatus = (
  status: CollectionItemStatus
): PageCollection["status"] => {
  switch (status) {
    case CollectionItemStatus.draft:
      return "draft";
    case CollectionItemStatus.published:
      return "publish";
  }
};

export const pageStatusToItemStatus = (
  status: PageCollection["status"]
): CollectionItemStatus => {
  switch (status) {
    case "draft":
      return CollectionItemStatus.draft;
    case "publish":
      return CollectionItemStatus.published;
  }
};

export const itemLayoutToPageLayout = (
  item: CollectionItem
): ShopifyPage["layout"] => {
  // Check for field in collection type, because collectionItem.fields fetches only fields that have value,
  // but wee need the field type id
  const id = item.type.fields?.find(
    // eslint-disable-next-line @typescript-eslint/camelcase
    item =>
      item.slug === "layout-template-id" &&
      item.__typename === "CollectionTypeFieldText"
  )?.id;

  if (!id) {
    throw new Error(
      "Invalid shopify collection, it is missing the layout field"
    );
  }

  const layout = item.fields?.find(
    // eslint-disable-next-line @typescript-eslint/camelcase
    (item): item is CollectionItemFragment_fields_CollectionItemFieldText =>
      item.type.id === id
  );

  return {
    id,
    value: layout?.textValues.value
  };
};

export const pageFieldsToItemFields = (
  page: ShopifyPage
): CollectionItemFieldInput[] => {
  if (page.layout.value) {
    return [{ type: page.layout.id, values: { value: page.layout.value } }];
  }

  return [];
};

export const itemToPageCollection = (item: CollectionItem): PageCollection => {
  const readData = mPipe(Json.read, Obj.read);

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    status: itemStatusToPageStatus(item.status),
    data: (readData(item.pageData) as PageCollection["data"]) ?? {
      items: []
    },
    dataVersion: 0,
    collectionType: {
      id: item.type.id,
      title: item.type.title
    },
    fields: item.fields
  };
};

export const itemToPageShopify = parseStrict<CollectionItem, ShopifyPage>({
  id: i => i.id,
  title: i => i.title,
  slug: i => i.slug,
  status: i => itemStatusToPageStatus(i.status),
  data: pipe(
    (i: CollectionItem) => i.pageData,
    mPipe(Json.read, Obj.read),
    v => (v as ShopifyPage["data"]) ?? { items: [] }
  ),
  dataVersion: () => 0,
  layout: itemLayoutToPageLayout
});

export const itemCustomerToPage = (item: CustomerItem): PageCustomer => {
  const readData = mPipe(Json.read, Obj.read);

  return {
    id: item.id,
    title: "Some title",
    data: (readData(item.pageData) as PageCustomer["data"]) ?? {
      items: []
    },
    status: "publish",
    dataVersion: 0
  };
};

export const getConverter = (): ((
  c: CollectionItem
) => PageCollection | ShopifyPage) =>
  match(
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    [isShopify, () => itemToPageShopify],
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    [isCMS, () => itemToPageCollection]
  )(Config.getAll() as Cloud);
