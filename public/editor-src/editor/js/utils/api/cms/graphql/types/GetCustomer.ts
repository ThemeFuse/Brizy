/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCustomer
// ====================================================

export interface GetCustomer_customer {
  __typename: "Customer";
  id: string;
  pageData: string | null;
}

export interface GetCustomer {
  customer: GetCustomer_customer | null;
}

export interface GetCustomerVariables {
  id: string;
}
