import produce from "immer";
import _ from "underscore";
import Config from "visual/global/Config";
import { request2 } from "visual/utils/api/editor";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";

// Form
const normalizeForm = res => {
  // transform completed integration
  // to normal data

  return produce(res, draft => {
    const { integrations, integration_smtps } = draft.data;
    const allIntegrations = [
      ...(Array.isArray(integrations) ? integrations : []),
      ...(Array.isArray(integration_smtps) ? integration_smtps : [])
    ];

    draft.data.integrations = allIntegrations.map(({ completed, type }) => ({
      id: type,
      completed
    }));
  });
};

export const getForm = ({ formId }) => {
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

export const createForm = ({ formId }) => {
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

export const updateForm = ({ formId, hasEmailTemplate, emailTemplate }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms/${formId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      hasEmailTemplate,
      emailTemplate,
      container: containerId
    })
  });
};

// Service mailchimp, zepier etc.
export const getIntegration = ({ formId, id }) => {
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

export const createIntegration = ({ formId, id }) => {
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

export const updateIntegration = ({ formId, id, ...appData }) => {
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

export const getIntegrationAccountApiKey = ({ id }) => {
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
      data: data.accountProperties || []
    }));
};

export const createIntegrationAccount = ({ type, data }) => {
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

export const createIntegrationList = ({ usedAccount, data }) => {
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
export const getSmtpIntegration = ({ formId, id }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/forms/${formId}/integration_smtps`, {
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

export const createSmtpIntegration = ({ formId, id }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms/${formId}/integration_smtps`, {
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

export const updateSmtpIntegration = ({ formId, id, ...appData }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");

  return request2(`${api}/forms/${formId}/integration_smtps/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      ...appData,
      container: containerId
    })
  })
    .then(parseJSON)
    .then(res => res);
};

// Recaptcha
/* eslint-disable no-unused-vars */
export const addRecaptcha = ({ group, service, ...data }) => {
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
/* eslint-enabled no-unused-vars */
