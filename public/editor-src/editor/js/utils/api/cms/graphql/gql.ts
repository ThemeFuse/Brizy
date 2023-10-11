import { ApolloQueryResult, FetchResult, gql } from "@apollo/client";
import {
  GetCustomerAndCollection,
  GetCustomerAndCollectionVariables
} from "visual/utils/api/cms/graphql/types/GetCustomerAndCollection";
import {
  UpdateCustomer,
  UpdateCustomerVariables
} from "visual/utils/api/cms/graphql/types/UpdateCustomer";
import { ApolloClient } from "./apollo";
import {
  CreateCollectionItem,
  CreateCollectionItemVariables
} from "./types/CreateCollectionItem";
import { GetCollectionItemFieldBySlug } from "./types/GetCollectionItemFieldBySlug";
import {
  GetCollectionItems,
  GetCollectionItemsVariables
} from "./types/GetCollectionItems";
import { GetCollectionTypeFieldBySlug } from "./types/GetCollectionTypeFieldBySlug";
import { GetCollectionTypesWithFields } from "./types/GetCollectionTypesWithFields";

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
            label
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

//#endregion

//#region CollectionItems

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

//#endregion

//#region Customers

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

//#endregion

//#refion Customers with Collection

export const getCustomersAndCollectionTypes = (
  apolloClient: ApolloClient,
  variables: GetCustomerAndCollectionVariables
): Promise<FetchResult<GetCustomerAndCollection>> =>
  apolloClient.query<
    GetCustomerAndCollection,
    GetCustomerAndCollectionVariables
  >({
    query: gql`
      query GetCustomerAndCollection($page: Int, $itemsPerPage: Int) {
        customers(page: $page, itemsPerPage: $itemsPerPage) {
          collection {
            id
            email
            firstName
            lastName
          }
        }
        customerGroups(page: $page) {
          collection {
            id
            name
          }
        }
        collectionTypes {
          id
          slug
          title
          settings {
            hidden
          }
          fields {
            id
            type
            label
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
    `,
    variables
  });

//#endregion
