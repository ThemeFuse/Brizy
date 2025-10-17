import { ConfigTab as PromptFormTab } from "visual/component/Prompts/PromptForm/types";
import { ConfigCommon } from "./configs/ConfigCommon";
import {
  Response as APIResponse,
  FormFieldsOption,
  SuccessResponse
} from "./configs/common";

// Forms

export interface IntegrationType {
  id: string;
  type: string;
  completed: boolean;
}

export interface FormData {
  integrations: IntegrationType[];
  notifications?: IntegrationType[];
  emailTemplate: string;
  hasEmailTemplate: boolean;
}

export interface FormDataWithIntegrationList extends FormData {
  integrationList?: IntegrationType[];
}

export type GetForm = (
  data: { formId: string },
  config: ConfigCommon
) => Promise<FormDataWithIntegrationList>;

type UpdateFormData = {
  formId: string;
  hasEmailTemplate: boolean;
  emailTemplate: string;
};

export type UpdateForm = (
  data: UpdateFormData,
  config: ConfigCommon
) => Promise<SuccessResponse>;

// Integrations

interface Account {
  id: string;
  name: string;
}

interface IntegrationResponse {
  accounts: Array<Account>;
  subject: string;
  emailTo: string;
}

export type GetIntegration = (
  data: {
    formId: string;
    id: string;
  },
  config: ConfigCommon
) => Promise<IntegrationResponse>;

interface UpdateIntegrationData {
  formId: string;
  id: string;
  type: string;
  confirmationNeeded: boolean;
  usedList: string;
  usedFolder: string;
  fieldsMap: string;
  usedAccount?: string | null;
  completed?: boolean;
}
export type UpdateIntegration = (
  data: UpdateIntegrationData,
  config: ConfigCommon
) => Promise<IntegrationResponse>;

interface IntegrationAccountApiKeyResponse {
  name: string;
  value?: string;
  hidden?: boolean;
  description?: string;
}
export type GetIntegrationAccountApiKey = (
  data: {
    formId: string;
    id: string;
  },
  config: ConfigCommon
) => Promise<IntegrationAccountApiKeyResponse>;

interface IntegrationAccountResponse {
  id: number;
  type: string;
  name: string;
}

interface CreateIntegrationAccountData {
  formId: string;
  id: string;
  type: string;
  data: { [k: string]: string };
}

export type CreateIntegrationAccount = (
  data: CreateIntegrationAccountData,
  config: ConfigCommon
) => Promise<IntegrationAccountResponse>;

interface CreateIntegrationListData {
  formId: string;
  id: string;
  data: Record<string, string>;
  usedAccount: string;
}

export type CreateIntegrationList = (
  data: CreateIntegrationListData,
  config: ConfigCommon
) => Promise<{
  formId: string;
  id: string;
  data: Record<string, string>;
  usedAccount: string;
}>;

// Smtp
export type SmptIntegrationResponse = {
  subject: string;
  emailTo: string;
};

export type GetSmtpIntegration = (
  data: {
    formId: string;
    id: string;
  },
  config: ConfigCommon,
  id: string
) => Promise<SmptIntegrationResponse>;

export type UpdateSmtpIntegration = (
  data: {
    [k: string]: unknown;
    formId: string;
    completed: boolean;
  },
  config: ConfigCommon,
  id: string
) => Promise<SmptIntegrationResponse>;

export type DeleteSmtpIntegration = (
  data: {
    formId: string;
    integration: string;
    notificationId: string;
  },
  config: ConfigCommon,
  id: string
) => Promise<SuccessResponse>;

// Recaptcha

interface AddRecaptchaData {
  group: string;
  service: string;
  sitekey: string;
  secretkey: string;
  response: string;
}

export type AddRecaptcha = (
  data: AddRecaptchaData,
  config: ConfigCommon
) => Promise<SuccessResponse>;

export type GetAccount = (
  data: {
    group: string;
    services: string;
  },
  config: ConfigCommon
) => Promise<Array<{ group: string; services: string }>>;

export type AddAccount = (
  data: {
    group: string;
    service: string;
    [apiKey: string]: string;
  },
  config: ConfigCommon
) => Promise<SuccessResponse>;

export type DeleteAccount = (
  id: string,
  config: ConfigCommon
) => Promise<SuccessResponse>;

export interface Form {
  showIntegrations?: boolean;
  action?: string;
  recaptcha?: {
    siteKey: string;
  };
  fields?: {
    label?: string;
    handler: (
      res: APIResponse<Array<FormFieldsOption>>,
      rej: APIResponse<string>
    ) => void;
  };
  tabs?: PromptFormTab[];
  getForm: (
    res: APIResponse<FormData>,
    rej: APIResponse<string>,
    data: { formId: string }
  ) => void;
  updateForm: (
    res: APIResponse<SuccessResponse>,
    rej: APIResponse<string>,
    data: UpdateFormData
  ) => void;
  getIntegration: (
    res: APIResponse<IntegrationResponse>,
    rej: APIResponse<string>,
    data: { formId: string; id: string }
  ) => void;
  updateIntegration: (
    res: APIResponse<IntegrationResponse>,
    rej: APIResponse<string>,
    data: UpdateIntegrationData
  ) => void;
  getSmtpIntegration: (
    res: APIResponse<SmptIntegrationResponse>,
    rej: APIResponse<string>,
    data: { formId: string; id: string },
    id: string
  ) => void;
  updateSmtpIntegration: (
    res: APIResponse<SmptIntegrationResponse>,
    rej: APIResponse<string>,
    data: {
      formId: string;
      completed: boolean;
      [k: string]: unknown;
    },
    id: string
  ) => void;
  deleteSmtpIntegration: (
    res: APIResponse<SuccessResponse>,
    rej: APIResponse<string>,
    data: { formId: string; integration: string },
    id: string
  ) => void;
  createIntegrationAccount: (
    res: APIResponse<{
      id: number;
      type: string;
      name: string;
    }>,
    rej: APIResponse<string>,
    data: CreateIntegrationAccountData
  ) => void;
  getIntegrationAccountApiKey: (
    res: APIResponse<IntegrationAccountApiKeyResponse>,
    rej: APIResponse<string>,
    data: { formId: string; id: string }
  ) => void;
  createIntegrationList: (
    res: APIResponse<CreateIntegrationListData>,
    rej: APIResponse<string>,
    data: CreateIntegrationListData
  ) => void;
  addRecaptcha: (
    res: APIResponse<SuccessResponse>,
    rej: APIResponse<string>,
    data: AddRecaptchaData
  ) => void;
  addAccount: (
    res: APIResponse<SuccessResponse>,
    rej: APIResponse<string>,
    data: {
      group: string;
      service: string;
      [apiKey: string]: string;
    }
  ) => void;
  deleteAccount: (
    res: APIResponse<SuccessResponse>,
    rej: APIResponse<string>,
    data: { id: string }
  ) => void;
  getAccounts: (
    res: APIResponse<Array<{ group: string; services: string }>>,
    rej: APIResponse<string>,
    data: { group: string; services: string }
  ) => void;
}
