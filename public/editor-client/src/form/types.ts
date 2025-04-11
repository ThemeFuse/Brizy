import { Response, ResponseWithBody } from "@/types/Response";

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

type FormResponse = Response<ResponseWithBody<FormData>>;

interface Account {
  id: string;
  name: string;
}

interface IntegrationResponse {
  status: number;
  data: {
    accounts: Array<Account>;
    subject: string;
    emailTo: string;
  } | null;
}

export interface UpdateIntegrationData {
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

interface IntegrationAccountApiKeyResponse {
  status: number;
  data: Array<{
    name: string;
    value?: string;
    hidden?: boolean;
    description?: string;
  }>;
}

export interface CreateIntegrationListData {
  formId: string;
  id: string;
  data: Record<string, string>;
  usedAccount: string;
}

type CreateIntegrationList = (
  res: Response<ResponseWithBody<CreateIntegrationListData>>,
  rej: Response<string>,
  data: CreateIntegrationListData
) => void;

export interface CreateIntegrationAccountData {
  formId: string;
  id: string;
  type: string;
  data: { [k: string]: string };
}

export interface AddRecaptchaData {
  group: string;
  service: string;
  sitekey: string;
  secretkey: string;
  response: string;
}

export interface IntegrationAccountResponse {
  id: number;
  type: string;
  name: string;
}

export interface NormalizeAccountsResolve {
  status: number;
  data: Array<{ group: string; services: string }> | null;
}

export interface Form {
  getForm: (
    res: FormResponse,
    rej: Response<string>,
    data: { formId: string }
  ) => void;
  createForm: (
    res: FormResponse,
    rej: Response<string>,
    data: { formId: string }
  ) => void;
  updateForm: (
    res: Response<unknown>,
    rej: Response<string>,
    data: {
      formId: string;
      hasEmailTemplate: boolean;
      emailTemplate: string;
    }
  ) => void;
  getIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: { formId: string; id: string }
  ) => void;
  createIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: { formId: string; id: string }
  ) => void;
  updateIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: UpdateIntegrationData
  ) => void;
  getIntegrationAccountApiKey: (
    res: Response<IntegrationAccountApiKeyResponse>,
    rej: Response<string>,
    data: { formId: string; id: string; accountId: string }
  ) => void;
  createIntegrationAccount: (
    res: Response<ResponseWithBody<IntegrationAccountResponse>>,
    rej: Response<string>,
    data: CreateIntegrationAccountData
  ) => void;
  createIntegrationList: CreateIntegrationList;
  getSmtpIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: { formId: string; id: string }
  ) => void;
  createSmtpIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: { formId: string; id: string }
  ) => void;
  updateSmtpIntegration: (
    res: Response<IntegrationResponse>,
    rej: Response<string>,
    data: UpdateIntegrationData
  ) => void;
  deleteSmtpIntegration: (
    res: Response<unknown>,
    rej: Response<string>,
    data: { formId: string; integration: string }
  ) => void;
  addRecaptcha: (
    res: Response<ResponseWithBody<unknown>>,
    rej: Response<string>,
    data: AddRecaptchaData
  ) => void;
  getAccounts: (
    res: Response<NormalizeAccountsResolve>,
    rej: Response<string>,
    data: {
      group: string;
      services: string;
    }
  ) => void;
  addAccount: (
    res: Response<ResponseWithBody<unknown>>,
    rej: Response<string>,
    data: {
      group: string;
      service: string;
    }
  ) => void;
  deleteAccount: (
    res: Response<{
      status: number;
    }>,
    rej: Response<string>,
    data: {
      id: string;
    }
  ) => void;
}
