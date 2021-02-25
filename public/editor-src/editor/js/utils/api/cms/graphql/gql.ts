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
  CreateTemplate,
  CreateTemplateVariables
} from "./types/CreateTemplate";
import {
  UpdateTemplate,
  UpdateTemplateVariables
} from "./types/UpdateTemplate";

//#region CollectionItem fragment
const collectionItemFragment = gql`
  fragment CollectionItemFragment on CollectionItem {
    id
    title
    slug
    status
    createdAt
    type {
      id
      title
    }
    fields @include(if: $withFields) {
      id
      values
      type {
        collectionType {
          id
          title
        }
      }
    }
    template {
      id
      data
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
          values
          type {
            id
            slug
          }
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
      mutation CreateCollectionItem($input: createCollectionItemInput!) {
        createCollectionItem(input: $input, $withFields: Boolean = false) {
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
            type {
              id
            }
            template {
              id
              data
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

//#region Templates
export const createTemplate = (
  apolloClient: ApolloClient,
  variables: CreateTemplateVariables
): Promise<FetchResult<CreateTemplate>> =>
  apolloClient.mutate<CreateTemplate, CreateTemplateVariables>({
    mutation: gql`
      mutation CreateTemplate($input: createTemplateInput!) {
        createTemplate(input: $input) {
          template {
            id
            data
          }
        }
      }
    `,
    variables
  });

export const updateTemplate = (
  apolloClient: ApolloClient,
  variables: UpdateTemplateVariables
): Promise<FetchResult<UpdateTemplate>> =>
  apolloClient.mutate<UpdateTemplate, UpdateTemplateVariables>({
    mutation: gql`
      mutation UpdateTemplate($input: updateTemplateInput!) {
        updateTemplate(input: $input) {
          template {
            id
            data
          }
        }
      }
    `,
    variables
  });
//#endregion
