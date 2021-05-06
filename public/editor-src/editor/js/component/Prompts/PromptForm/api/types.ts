import { Response } from "visual/utils/api/response";

// Forms

type IntegrationType = {
  id: string;
  type: string;
  completed: boolean;
};
export type FormResponse = {
  status: Response["status"];
  data: {
    integrations: IntegrationType[];
    notifications?: IntegrationType[];
    emailTemplate: string;
    hasEmailTemplate: boolean;
  } | null;
};

export type GetForm = (data: { formId: string }) => Promise<FormResponse>;

export type CreateForm = (data: { formId: string }) => Promise<FormResponse>;

type UpdateFormData = {
  formId: string;
  hasEmailTemplate: boolean;
  emailTemplate: string;
};
export type UpdateForm = (data: UpdateFormData) => Promise<unknown>;

// Integrations
export type IntegrationResponse = {
  status: Response["status"];
  data: {
    subject: string;
    emailTo: string;
  } | null;
};

export type GetIntegration = (data: {
  formId: string;
  id: string;
}) => Promise<IntegrationResponse>;

export type CreateIntegration = (data: {
  formId: string;
  id: string;
}) => Promise<IntegrationResponse>;

export type UpdateIntegration = (data: {
  formId: string;
  id: string;
  type: string;
  completed: boolean;
  confirmationNeeded: boolean;
  usedAccount: string;
  usedList: string;
  usedFolder: string;
  fieldsMap: string;
}) => Promise<IntegrationResponse>;

export type IntegrationAccountApiKeyResponse = {
  status: Response["status"];
  data: {
    accountProperties: Array<{ name: string }>;
  } | null;
};
export type GetIntegrationAccountApiKey = (data: {
  formId: string;
  id: string;
}) => Promise<IntegrationAccountApiKeyResponse>;

export type IntegrationAccountResponse = {
  status: Response["status"];
  data: {
    id: number;
    type: string;
    name: string;
  } | null;
};
export type CreateIntegrationAccount = (data: {
  id: string;
  formId: string;
  type: string;
  data: { [k: string]: string };
}) => Promise<IntegrationAccountResponse>;

export type CreateIntegrationList = (data: {
  formId: string;
  id: string;
  data: {};
  usedAccount: string;
}) => Promise<Response>;

// Smtp

export type SmptIntegrationResponse = {
  status: Response["status"];
  data: {
    subject: string;
    emailTo: string;
  } | null;
};

export type GetSmptIntegration = (data: {
  formId: string;
  id: string;
}) => Promise<SmptIntegrationResponse>;

export type CreateSmptIntegration = (data: {
  formId: string;
  id?: string;
}) => Promise<SmptIntegrationResponse>;

export type UpdateSmptIntegration = (data: {
  formId: string;
  id: string;
  subject: string;
  emailTo: string;
}) => Promise<SmptIntegrationResponse>;

// Recaptcha

export type AddRecaptcha = (data: {
  group: string;
  service: string;
  sitekey: string;
  secretkey: string;
  response: string;
}) => Promise<Response>;
