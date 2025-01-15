import { ResponseWithBody } from "visual/component/Prompts/common/utils/Request";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/utils/api/response";


// Forms

export type IntegrationType = {
  id: string;
  type: string;
  completed: boolean;
};

export type FormData = {
  integrations: IntegrationType[];
  notifications?: IntegrationType[];
  emailTemplate: string;
  hasEmailTemplate: boolean;
};

export type FormResponse = ResponseWithBody<FormData | undefined>;

export type GetForm = (data: { formId: string }) => Promise<FormResponse>;

export type CreateForm = (data: { formId: string }) => Promise<FormResponse>;

type UpdateFormData = {
  formId: string;
  hasEmailTemplate: boolean;
  emailTemplate: string;
};
export type UpdateForm = (data: UpdateFormData) => Promise<unknown>;

// Integrations

interface Account {
  id: string;
  name: string;
}

export type IntegrationResponse = {
  status: Response["status"];
  data: {
    accounts: Array<Account>;
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
  data: Array<{
    name: string;
    value?: string;
    hidden?: boolean;
    description?: string;
  }>;
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
  data: Record<string, string>;
  usedAccount: string;
}) => Promise<
  ResponseWithBody<{
    formId: string;
    id: string;
    data: Record<string, string>;
    usedAccount: string;
  }>
>;

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
  [k: string]: string | boolean;
  formId: string;
  completed: boolean;
}) => Promise<SmptIntegrationResponse>;

export type DeleteSmtpIntegration = (
  data: {
    formId: string;
    integration: string;
    notificationId: string;
  },
  config: ConfigCommon
) => Promise<Response>;

// Recaptcha

export type AddRecaptcha = (data: {
  group: string;
  service: string;
  sitekey: string;
  secretkey: string;
  response: string;
}) => Promise<ResponseWithBody<unknown>>;
