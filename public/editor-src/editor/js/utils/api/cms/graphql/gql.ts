import { ApolloQueryResult, FetchResult, gql } from "@apollo/client";
import { ApolloClient } from "./apollo";
import { graphQLIdPrefixes } from "./convertors";
import { GetCollectionTypesWithFields } from "./types/GetCollectionTypesWithFields";
import {
  GetCollectionItems,
  GetCollectionItemsVariables
} from "./types/GetCollectionItems";
import {
  GetCollectionItem,
  GetCollectionItemVariables
} from "./types/GetCollectionItem";
import { GetCollectionItemFieldBySlug } from "./types/GetCollectionItemFieldBySlug";
import { GetCollectionTypeFieldBySlug } from "./types/GetCollectionTypeFieldBySlug";
import {
  CreateCollectionItem,
  CreateCollectionItemVariables
} from "./types/CreateCollectionItem";
import {
  UpdateCollectionItem,
  UpdateCollectionItemVariables
} from "./types/UpdateCollectionItem";
import {
  DeleteCollectionItem,
  DeleteCollectionItemVariables
} from "./types/DeleteCollectionItem";
import {
  ReferencedCollectionItems,
  ReferencedCollectionItemsVariables
} from "./types/ReferencedCollectionItems";
import {
  GetCustomer,
  GetCustomerVariables
} from "visual/utils/api/cms/graphql/types/GetCustomer";
import {
  UpdateCustomer,
  UpdateCustomerVariables
} from "visual/utils/api/cms/graphql/types/UpdateCustomer";
import {
  GetCustomers,
  GetCustomersVariables
} from "visual/utils/api/cms/graphql/types/GetCustomers";

//#region CollectionItem fragment
const collectionItemFragment = gql`
  fragment CollectionItemFragment on CollectionItem {
    id
    title
    slug
    status
    pageData
    createdAt
    type {
      id
      title
      slug
      fields @include(if: $withFields) {
        id
        slug
      }
    }
    fields @include(if: $withFields) {
      id
      type {
        id
        slug
        collectionType {
          id
          title
        }
      }
      ... on CollectionItemFieldText {
        textValues {
          value
        }
      }

      ... on CollectionItemFieldMultiReference {
        multiReferenceValues {
          collectionItems {
            id
          }
        }
      }
      ... on CollectionItemFieldReference {
        referenceValues {
          collectionItem {
            id
          }
        }
      }
    }
  }
`;
//#endregion

//#region CollectionTypes
export const getCollectionTypesWithFields = (
  apolloClient: ApolloClient
): Promise<ApolloQueryResult<GetCollectionTypesWithFields>> =>
  apolloClient.query<GetCollectionTypesWithFields>({
    query: gql`
      query GetCollectionTypesWithFields {
        collectionTypes {
          id
          slug
          title
          fields {
            id
            type
            ... on CollectionTypeFieldReference {
              referenceSettings {
                collectionType {
                  id
                  title
                }
              }
            }
            ... on CollectionTypeFieldMultiReference {
              multiReferenceSettings {
                collectionType {
                  id
                  title
                }
              }
            }
          }
        }
      }
    `
  });
//#endregion

export const collectionTypeFieldBySlug = (
  apolloClient: ApolloClient,
  {
    collectionId,
    collectionFieldSlug
  }: { collectionId: string; collectionFieldSlug: string }
): Promise<ApolloQueryResult<GetCollectionTypeFieldBySlug>> =>
  apolloClient.query<GetCollectionTypeFieldBySlug>({
    query: gql`
      query GetCollectionTypeFieldBySlug($collectionType: ID!, $slug: String!) {
        collectionTypeFieldBySlug(
          collectionType: $collectionType
          slug: $slug
        ) {
          id
        }
      }
    `,
    variables: {
      collectionType: collectionId,
      slug: collectionFieldSlug
    }
  });

export const collectionItemFieldBySlug = (
  apolloClient: ApolloClient,
  {
    collectionItemId,
    collectionItemFieldSlug
  }: { collectionItemId: string; collectionItemFieldSlug: string }
): Promise<ApolloQueryResult<GetCollectionItemFieldBySlug>> =>
  apolloClient.query<GetCollectionItemFieldBySlug>({
    query: gql`
      query GetCollectionItemFieldBySlug($item: ID!, $slug: String!) {
        collectionItemFieldBySlug(item: $item, slug: $slug) {
          id
          type {
            id
            slug
          }
          values
        }
      }
    `,
    variables: {
      slug: collectionItemFieldSlug,
      item: collectionItemId
    }
  });

//#region CollectionItems
export const getCollectionItems = (
  apolloClient: ApolloClient,
  {
    collectionTypeId,
    page,
    itemsPerPage
  }: {
    collectionTypeId: string;
    page: number;
    itemsPerPage: number;
    withFields?: boolean;
  }
): Promise<ApolloQueryResult<GetCollectionItems>> =>
  apolloClient.query<GetCollectionItems, GetCollectionItemsVariables>({
    query: gql`
      query GetCollectionItems(
        $type: ID!
        $page: Int
        $itemsPerPage: Int
        $withFields: Boolean = false
      ) {
        collectionItems(type: $type, page: $page, itemsPerPage: $itemsPerPage) {
          collection {
            ...CollectionItemFragment
          }
        }
      }
      ${collectionItemFragment}
    `,
    variables: {
      type: collectionTypeId,
      page,
      itemsPerPage
    }
  });

export const getCollectionItem = (
  apolloClient: ApolloClient,
  variables: GetCollectionItemVariables & { withFields?: boolean }
): Promise<ApolloQueryResult<GetCollectionItem>> =>
  apolloClient.query<GetCollectionItem, GetCollectionItemVariables>({
    query: gql`
      query GetCollectionItem($id: ID!, $withFields: Boolean = true) {
        collectionItem(id: $id) {
          ...CollectionItemFragment
        }
      }
      ${collectionItemFragment}
    `,
    variables
  });

export const createCollectionItem = (
  apolloClient: ApolloClient,
  variables: CreateCollectionItemVariables & { withFields?: boolean }
): Promise<FetchResult<CreateCollectionItem>> =>
  apolloClient.mutate<CreateCollectionItem, CreateCollectionItemVariables>({
    mutation: gql`
      mutation CreateCollectionItem(
        $input: createCollectionItemInput!
        $withFields: Boolean = false
      ) {
        createCollectionItem(input: $input) {
          collectionItem {
            ...CollectionItemFragment
          }
        }
      }
      ${collectionItemFragment}
    `,
    variables
  });

export const updateCollectionItem = (
  apolloClient: ApolloClient,
  variables: UpdateCollectionItemVariables
): Promise<FetchResult<UpdateCollectionItem>> =>
  apolloClient.mutate<UpdateCollectionItem, UpdateCollectionItemVariables>({
    mutation: gql`
      mutation UpdateCollectionItem($input: updateCollectionItemInput!) {
        updateCollectionItem(input: $input) {
          collectionItem {
            id
            title
            slug
            status
            createdAt
            pageData
            type {
              id
            }
          }
        }
      }
    `,
    variables
  });

export const deleteCollectionItem = (
  apolloClient: ApolloClient,
  id: number
): Promise<FetchResult<DeleteCollectionItem>> =>
  apolloClient.mutate<DeleteCollectionItem, DeleteCollectionItemVariables>({
    mutation: gql`
      mutation DeleteCollectionItem($input: deleteCollectionItemInput!) {
        deleteCollectionItem(input: $input) {
          collectionItem {
            id
          }
        }
      }
    `,
    variables: {
      input: {
        id: `${graphQLIdPrefixes.collectionItem}${id}`
      }
    }
  });
//#endregion

//#region ReferencedCollectionItems
export const getReferencedCollectionItems = (
  apolloClient: ApolloClient,
  variables: ReferencedCollectionItemsVariables
): Promise<ApolloQueryResult<ReferencedCollectionItems>> =>
  apolloClient.query<
    ReferencedCollectionItems,
    ReferencedCollectionItemsVariables
  >({
    query: gql`
      query ReferencedCollectionItems(
        $type: ID!
        $page: Int
        $itemsPerPage: Int
        $withFields: Boolean = false
      ) {
        referencedCollectionItems(
          itemsPerPage: $itemsPerPage
          page: $page
          reference: $type
        ) {
          collection {
            ...CollectionItemFragment
          }
        }
      }
      ${collectionItemFragment}
    `,
    variables
  });
//#endregion

//#region Customers
export const getCustomer = (
  apolloClient: ApolloClient,
  variables: GetCustomerVariables
): Promise<ApolloQueryResult<GetCustomer>> =>
  apolloClient.query<GetCustomer, GetCustomerVariables>({
    query: gql`
      query GetCustomer($id: ID!) {
        customer(id: $id) {
          id
          pageData
        }
      }
    `,
    variables
  });

export const updateCustomer = (
  apolloClient: ApolloClient,
  variables: UpdateCustomerVariables
): Promise<FetchResult<UpdateCustomer>> =>
  apolloClient.mutate<UpdateCustomer, UpdateCustomerVariables>({
    mutation: gql`
      mutation UpdateCustomer($input: updateCustomerInput!) {
        updateCustomer(input: $input) {
          customer {
            id
            pageData
          }
        }
      }
    `,
    variables
  });

export const getCustomers = (
  apolloClient: ApolloClient,
  variables: GetCustomersVariables
): Promise<FetchResult<GetCustomers>> =>
  apolloClient.query<GetCustomers, GetCustomersVariables>({
    query: gql`
      query GetCustomers($page: Int, $itemsPerPage: Int) {
        customers(page: $page, itemsPerPage: $itemsPerPage) {
          collection {
            id
            email
            firstName
            lastName
          }
        }
      }
    `,
    variables
  });
//#endregion
