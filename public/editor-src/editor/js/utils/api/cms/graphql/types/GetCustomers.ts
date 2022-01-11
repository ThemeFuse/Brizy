/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCustomers
// ====================================================

export interface GetCustomers_customers_collection {
  __typename: "Customer";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface GetCustomers_customers {
  __typename: "CustomerConnection";
  collection: (GetCustomers_customers_collection | null)[] | null;
}

export interface GetCustomers {
  customers: GetCustomers_customers | null;
}

export interface GetCustomersVariables {
  page?: number | null;
  itemsPerPage?: number | null;
}
