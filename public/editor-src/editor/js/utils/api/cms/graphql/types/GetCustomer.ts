/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCustomer
// ====================================================

export interface GetCustomer_customer_customerGroups {
  __typename: "CustomerGroup";
  id: string;
  name: string | null;
}

export interface GetCustomer_customer {
  __typename: "Customer";
  id: string;
  pageData: string | null;
  customerGroups: GetCustomer_customer_customerGroups[] | null;
}

export interface GetCustomer {
  customer: GetCustomer_customer | null;
}

export interface GetCustomerVariables {
  id: string;
}
