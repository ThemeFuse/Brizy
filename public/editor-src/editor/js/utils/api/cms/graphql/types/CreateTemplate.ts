/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { createTemplateInput } from "./entities";

// ====================================================
// GraphQL mutation operation: CreateTemplate
// ====================================================

export interface CreateTemplate_createTemplate_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface CreateTemplate_createTemplate {
  __typename: "createTemplatePayload";
  template: CreateTemplate_createTemplate_template | null;
}

export interface CreateTemplate {
  /**
   * Creates a Template.
   */
  createTemplate: CreateTemplate_createTemplate | null;
}

export interface CreateTemplateVariables {
  input: createTemplateInput;
}
