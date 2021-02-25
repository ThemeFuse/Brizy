import produce from "immer";
import _ from "underscore";
import Config from "visual/global/Config";
import { request2 } from "visual/utils/api";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import {
  CreateForm,
  GetForm,
  FormResponse,
  UpdateForm,
  GetIntegration,
  GetSmptIntegration,
  CreateSmptIntegration,
  UpdateSmptIntegration,
  CreateIntegration,
  UpdateIntegration,
  GetIntegrationAccountApiKey,
  CreateIntegrationAccount,
  CreateIntegrationList,
  AddRecaptcha
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
          ? notifications.map(a => ({ ...a, type: "email" }))
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

export const getForm: GetForm = ({ formId }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/forms/${formId}`, {
    container: containerId
  });

  return request2(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(normalizeForm);
};

export const createForm: CreateForm = ({ formId }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      uid: formId,
      container: containerId
    })
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateForm: UpdateForm = ({
  formId,
  hasEmailTemplate,
  emailTemplate
}) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/forms/${formId}`, {
    container: containerId
  });

  return request2(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      hasEmailTemplate,
      emailTemplate
    })
  });
};

// Service mailchimp, zepier etc.
export const getIntegration: GetIntegration = ({ formId, id }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/forms/${formId}/integrations`, {
    type: id,
    container: containerId
  });

  return request2(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
};

export const createIntegration: CreateIntegration = ({ formId, id }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms/${formId}/integrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      type: id,
      container: containerId
    })
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateIntegration: UpdateIntegration = ({
  formId,
  id,
  ...appData
}) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const data = _.pick(appData, [
    "type",
    "completed",
    "confirmationNeeded",
    "usedAccount",
    "usedList",
    "usedFolder",
    "fieldsMap"
  ]);

  return request2(`${api}/forms/${formId}/integrations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      ...data,
      container: containerId
    })
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegrationAccountApiKey: GetIntegrationAccountApiKey = ({
  id
}) => {
  const { api } = Config.get("urls");

  return request2(`${api}/services/${id}/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(({ status, data }) => ({
      status,
      data: data?.accountProperties || []
    }));
};

export const createIntegrationAccount: CreateIntegrationAccount = ({
  type,
  data
}) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      type,
      container: containerId,
      data: JSON.stringify(data)
    })
  })
    .then(parseJSON)
    .then(res => res);
};

export const createIntegrationList: CreateIntegrationList = ({
  usedAccount,
  data
}) => {
  const { api } = Config.get("urls");

  return request2(`${api}/accounts/${usedAccount}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      data: JSON.stringify(data)
    })
  })
    .then(parseJSON)
    .then(res => res);
};

// Email smtp, gmailSmtp
export const getSmtpIntegration: GetSmptIntegration = ({ formId, id }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/forms/${formId}/notifications`, {
    type: id,
    container: containerId
  });

  return request2(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(parseJSON)
    .then(res => res);
};

export const createSmtpIntegration: CreateSmptIntegration = ({ formId }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms/${formId}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      container: containerId
    })
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateSmtpIntegration: UpdateSmptIntegration = ({
  formId,
  id,
  ...data
}) => {
  const { api } = Config.get("urls");

  return request2(`${api}/forms/${formId}/notifications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

// Recaptcha
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addRecaptcha: AddRecaptcha = ({ group, service, ...data }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      type: group,
      container: containerId,
      data: JSON.stringify(data)
    })
  })
    .then(parseJSON)
    .then(res => res);
};
