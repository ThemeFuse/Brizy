import { PageCloud } from "visual/types";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import { CollectionItemStatus } from "visual/utils/api/cms/graphql/types/entities";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import { mPipe } from "visual/utils/fp/mPipe";

export const itemStatusToPageStatus = (
  status: CollectionItemStatus
): PageCloud["status"] => {
  switch (status) {
    case CollectionItemStatus.draft:
      return "draft";
    case CollectionItemStatus.published:
      return "publish";
  }
};

export const pageStatusToItemStatus = (
  status: PageCloud["status"]
): CollectionItemStatus => {
  switch (status) {
    case "draft":
      return CollectionItemStatus.draft;
    case "publish":
      return CollectionItemStatus.published;
  }
};

export const itemToPage = (item: CollectionItem): PageCloud => {
  const readData = mPipe(Json.read, Obj.read);

  return {
    _kind: "cloud-cms",
    id: item.id,
    title: item.title,
    slug: item.slug,
    status: itemStatusToPageStatus(item.status),
    data: (readData(item.pageData) as PageCloud["data"]) ?? {
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
