import { pick } from "es-toolkit";
import { produce } from "immer";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { request } from "visual/utils/api";
import {
  AddRecaptcha,
  CreateForm,
  CreateIntegration,
  CreateIntegrationAccount,
  CreateIntegrationList,
  CreateSmptIntegration,
  DeleteSmtpIntegration,
  FormData,
  FormResponse,
  GetForm,
  GetIntegration,
  GetIntegrationAccountApiKey,
  GetSmptIntegration,
  UpdateForm,
  UpdateIntegration,
  UpdateSmptIntegration
} from "./types";

// Form
const normalizeForm = (res: FormResponse): FormResponse => {
  // transform completed integration
  // to normal data

  return produce(res, (draft: FormResponse) => {
    if (draft.data) {
      const { integrations, notifications } = draft.data;
      const allIntegrations = [
        ...(Array.isArray(integrations) ? integrations : []),
        ...(Array.isArray(notifications)
          ? notifications.map((a) => ({ ...a, type: "email" }))
          : [])
      ];

      draft.data.integrations = allIntegrations.map(({ completed, type }) => ({
        type,
        completed,
        id: type
      }));
    }
  });
};

export const getForm: GetForm = ({ formId }, config) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/forms/${formId}`, {
    container: containerId.toString()
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  )
    .then((r) => parseJSON<FormData>(r))
    .then(normalizeForm);
};

export const createForm: CreateForm = ({ formId }, config: ConfigCommon) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/forms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        uid: formId,
        container: containerId
      })
    },
    config
  )
    .then((r) => parseJSON<FormData>(r))
    .then((res) => res);
};

export const updateForm: UpdateForm = (
  { formId, hasEmailTemplate, emailTemplate },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/forms/${formId}`, {
    container: containerId.toString()
  });

  return request(
    url,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        hasEmailTemplate,
        emailTemplate
      })
    },
    config
  );
};

// Service mailchimp, zepier etc.
export const getIntegration: GetIntegration = ({ formId, id }, config) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/forms/${formId}/integrations`, {
    type: id,
    container: containerId.toString()
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
};

export const createIntegration: CreateIntegration = (
  { formId, id },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/forms/${formId}/integrations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        type: id,
        container: containerId
      })
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
};

export const updateIntegration: UpdateIntegration = (
  { formId, id, ...appData },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const data = pick(appData, [
    "type",
    "completed",
    "confirmationNeeded",
    "usedAccount",
    "usedList",
    "usedFolder",
    "fieldsMap"
  ]);

  return request(
    `${api}/forms/${formId}/integrations/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        ...data,
        container: containerId
      })
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
};

export const getIntegrationAccountApiKey: GetIntegrationAccountApiKey = (
  { id },
  config
) => {
  const { api } = config.urls ?? {};

  return request(
    `${api}/services/${id}/config`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  )
    .then((r) =>
      parseJSON<{
        accountProperties: Array<{ name: string }>;
      } | null>(r)
    )
    .then(({ status, data }) => ({
      status,
      data: data?.accountProperties || []
    }));
};

export const createIntegrationAccount: CreateIntegrationAccount = (
  { type, data },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        type,
        container: containerId,
        data: JSON.stringify(data)
      })
    },
    config
  )
    .then((r) =>
      parseJSON<{
        id: number;
        type: string;
        name: string;
      } | null>(r)
    )
    .then((res) => res);
};

export const createIntegrationList: CreateIntegrationList = (
  { usedAccount, data },
  config
) => {
  const { api } = config.urls ?? {};

  return request(
    `${api}/accounts/${usedAccount}/lists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        data: JSON.stringify(data)
      })
    },
    config
  ).then((r) =>
    parseJSON<{
      formId: string;
      id: string;
      data: Record<string, string>;
      usedAccount: string;
    }>(r)
  );
};

// Email smtp, gmailSmtp
export const getSmtpIntegration: GetSmptIntegration = (
  { formId, id },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/forms/${formId}/notifications`, {
    type: id,
    container: containerId.toString()
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
    } | null>(r)
  );
};

export const createSmtpIntegration: CreateSmptIntegration = (
  { formId },
  config
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/forms/${formId}/notifications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        container: containerId
      })
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
    } | null>(r)
  );
};

export const updateSmtpIntegration: UpdateSmptIntegration = (
  { formId, id, ...data },
  config
) => {
  const { api } = config.urls ?? {};

  return request(
    `${api}/forms/${formId}/notifications/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    },
    config
  ).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
    } | null>(r)
  );
};

export const deleteSmtpIntegration: DeleteSmtpIntegration = (
  { formId, notificationId },
  config
) => {
  const { api } = config?.urls ?? {};

  return request(
    `${api}/forms/${formId}/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  ).then((r) => ({ status: r.status, message: r.statusText }));
};

// Recaptcha
export const addRecaptcha: AddRecaptcha = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { group, service, ...data },
  config: ConfigCommon
) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;

  return request(
    `${api}/accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        type: group,
        container: containerId,
        data: JSON.stringify(data)
      })
    },
    config
  ).then(parseJSON);
};
