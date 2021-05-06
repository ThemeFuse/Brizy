import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { MNullish, isNullish, isT } from "visual/utils/value";
import { paginationData } from "visual/utils/api/const";
import * as Gql from "./graphql/gql";
import { getConnection } from "./graphql/apollo";
import { GetCollectionTypesWithFields_collectionTypes as CollectionTypesWithFields } from "./graphql/types/GetCollectionTypesWithFields";
import { GetCollectionItem_collectionItem as CollectionItem } from "./graphql/types/GetCollectionItem";
import * as TMP from "./correctors";

const errOnEmpty = (m: string) => <T>(t: MNullish<T>): T => {
  if (isNullish(t)) {
    throw new CustomError(m);
  }

  return t;
};

const onCatch = (m: string) => (): never => {
  throw new CustomError(m);
};

export function getCollectionTypesWithFields(): Promise<
  CollectionTypesWithFields[]
> {
  return (
    Gql.getCollectionTypesWithFields(getConnection())
      .then(r => r.data?.collectionTypes)
      .then(errOnEmpty(t("Invalid api data")))
      .then(collections => collections.filter(isT))
      // TODO: remove this when api will be finished
      .then(TMP.correctCollectionTypesWithFields)
      .catch(onCatch(t("Failed to fetch api data")))
  );
}

export function getCollectionItems(
  collectionId: string,
  filters?: {
    include?: string[];
    search?: string;
    status?: "draft" | "published" | "all";
  }
): Promise<CollectionItem[]> {
  const page = paginationData.page;
  const itemsPerPage = paginationData.count;

  return (
    Gql.getCollectionItems(getConnection(), {
      collectionTypeId: collectionId,
      page,
      itemsPerPage
    })
      .then(r => r?.data?.collectionItems?.collection)
      .then(errOnEmpty(t("Invalid api data")))
      .then(items => items.filter(isT))
      // TODO: remove this when api will be finished
      .then(TMP.correctCollectionItems(filters ?? {}))
      .catch(onCatch(t("Failed to fetch api data")))
  );
}

export function getCollectionItem(itemId: string): Promise<CollectionItem> {
  return Gql.getCollectionItem(getConnection(), { id: itemId })
    .then(r => r?.data?.collectionItem)
    .then(errOnEmpty(t("Invalid api data")))
    .catch(onCatch(t("Failed to fetch api data")));
}
