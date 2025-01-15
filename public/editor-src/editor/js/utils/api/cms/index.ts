import {
  GetCustomerAndCollection_collectionTypes as CustomerAndCollectionCollection,
  GetCustomerAndCollection_customers_collection as CustomerAndCollectionCustomer,
  GetCustomerAndCollection_customerGroups_collection as CustomerAndCollectionCustomerGroups
} from "visual/utils/api/cms/graphql/types/GetCustomerAndCollection";
import { paginationData } from "visual/utils/api/const";
import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { MNullish, isNullish, isT } from "visual/utils/value";
import * as TMP from "./correctors";
import { CreateApolloClientProps, getConnection } from "./graphql/apollo";
import * as Gql from "./graphql/gql";
import { GetCollectionItem_collectionItem as CollectionItem } from "./graphql/types/GetCollectionItem";
import { GetCollectionTypesWithFields_collectionTypes as CollectionTypesWithFields } from "./graphql/types/GetCollectionTypesWithFields";

const errOnEmpty =
  (m: string) =>
  <T>(t: MNullish<T>): T => {
    if (isNullish(t)) {
      throw new CustomError(m);
    }

    return t;
  };

const onCatch = (m: string) => (): never => {
  throw new CustomError(m);
};

export function getCollectionTypesWithFields(
  data: CreateApolloClientProps
): Promise<CollectionTypesWithFields[]> {
  return (
    Gql.getCollectionTypesWithFields(getConnection(data))
      .then((r) => r.data?.collectionTypes)
      .then(errOnEmpty(t("Invalid api data")))
      .then((collections) => collections.filter(isT))
      // TODO: remove this when api will be finished
      .then(TMP.correctCollectionTypesWithFields)
      .catch(onCatch(t("Failed to fetch api data")))
  );
}

export function getCollectionItems(
  collectionId: string,
  connection: CreateApolloClientProps,
  filters?: {
    include?: string[];
    search?: string;
    status?: "draft" | "published" | "all";
  }
): Promise<CollectionItem[]> {
  const page = paginationData.page;
  const itemsPerPage = paginationData.count;

  return (
    Gql.getCollectionItems(getConnection(connection), {
      collectionTypeId: collectionId,
      page,
      itemsPerPage
    })
      .then((r) => r?.data?.collectionItems?.collection)
      .then(errOnEmpty(t("Invalid api data")))
      .then((items) => items.filter(isT))
      // TODO: remove this when api will be finished
      .then(TMP.correctCollectionItems(filters ?? {}))
      .catch(onCatch(t("Failed to fetch api data")))
  );
}

//#region Customer & Collections

interface CustomerAndCollectionTypes {
  customers: CustomerAndCollectionCustomer[];
  customerGroups: CustomerAndCollectionCustomerGroups[];
  collectionTypes: CustomerAndCollectionCollection[];
}

export function getCustomersAndCollectionTypes(
  data: CreateApolloClientProps
): Promise<CustomerAndCollectionTypes> {
  const page = paginationData.page;
  const itemsPerPage = paginationData.count;

  return Gql.getCustomersAndCollectionTypes(getConnection(data), {
    page,
    itemsPerPage
  })
    .then((r) => ({
      customers: r.data?.customers?.collection,
      customerGroups: r.data?.customerGroups?.collection,
      collectionTypes: r.data?.collectionTypes
    }))
    .then(({ customers, customerGroups, collectionTypes }) => ({
      customers: customers ? customers.filter(isT) : [],
      customerGroups: customerGroups ? customerGroups.filter(isT) : [],
      collectionTypes: collectionTypes ? collectionTypes.filter(isT) : []
    }))
    .catch(onCatch(t("Failed to fetch api data")));
}

//#endregion
