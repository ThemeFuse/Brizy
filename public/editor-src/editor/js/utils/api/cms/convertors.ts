import { PageCollection, PageCustomer } from "visual/types";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import { CollectionItemStatus } from "visual/utils/api/cms/graphql/types/entities";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import { GetCustomer_customer as CustomerItem } from "visual/utils/api/cms/graphql/types/GetCustomer";
import { mPipe } from "visual/utils/fp/mPipe";

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

export const itemToPage = (item: CollectionItem): PageCollection => {
  const readData = mPipe(Json.read, Obj.read);

  return {
    _kind: "cloud-cms",
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

export const itemCustomerToPage = (item: CustomerItem): PageCustomer => {
  const readData = mPipe(Json.read, Obj.read);

  return {
    _kind: "cloud-customer",
    id: item.id,
    title: "Some title",
    data: (readData(item.pageData) as PageCustomer["data"]) ?? {
      items: []
    },
    status: "publish",
    dataVersion: 0
  };
};
