/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { updateCustomerInput } from "./entities";

// ====================================================
// GraphQL mutation operation: UpdateCustomer
// ====================================================

export interface UpdateCustomer_updateCustomer_customer {
  __typename: "Customer";
  id: string;
  pageData: string | null;
}

export interface UpdateCustomer_updateCustomer {
  __typename: "updateCustomerPayload";
  customer: UpdateCustomer_updateCustomer_customer | null;
}

export interface UpdateCustomer {
  /**
   * Updates a Customer.
   */
  updateCustomer: UpdateCustomer_updateCustomer | null;
}

export interface UpdateCustomerVariables {
  input: updateCustomerInput;
}
