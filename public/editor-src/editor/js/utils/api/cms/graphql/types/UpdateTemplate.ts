/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { updateTemplateInput } from "./entities";

// ====================================================
// GraphQL mutation operation: UpdateTemplate
// ====================================================

export interface UpdateTemplate_updateTemplate_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface UpdateTemplate_updateTemplate {
  __typename: "updateTemplatePayload";
  template: UpdateTemplate_updateTemplate_template | null;
}

export interface UpdateTemplate {
  /**
   * Updates a Template.
   */
  updateTemplate: UpdateTemplate_updateTemplate | null;
}

export interface UpdateTemplateVariables {
  input: updateTemplateInput;
}
