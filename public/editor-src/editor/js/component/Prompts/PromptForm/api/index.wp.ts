import _ from "underscore";
import Config from "visual/global/Config";
import { request2 } from "visual/utils/api";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import {
  AddRecaptcha,
  CreateForm,
  CreateIntegration,
  CreateIntegrationAccount,
  CreateIntegrationList,
  GetForm,
  GetIntegration,
  GetIntegrationAccountApiKey,
  UpdateForm,
  UpdateIntegration,
  UpdateSmptIntegration
} from "./types";

// Form
export const getForm: GetForm = ({ formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    formId,
    action: api.getForm,
    hash: api.hash,
    version
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

export const createForm: CreateForm = ({ formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createForm,
    hash: api.hash,
    version
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ id: formId })
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateForm: UpdateForm = ({
  formId,
  hasEmailTemplate,
  emailTemplate
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    formId,
    action: api.updateForm,
    hash: api.hash,
    version
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ hasEmailTemplate, emailTemplate })
  })
    .then(parseJSON)
    .then(res => res);
};

// Service mailchimp, zepier etc.
export const getIntegration: GetIntegration = ({ formId, id }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getIntegration,
    hash: api.hash,
    version,
    formId,
    integration: id
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
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createIntegration,
    hash: api.hash,
    version,
    formId
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ id })
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateIntegration: UpdateIntegration = ({
  formId,
  ...appData
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.updateIntegration,
    hash: api.hash,
    version,
    formId
  });
  const data = _.pick(appData, [
    "id",
    "usedAccount",
    "fieldsMap",
    "usedList",
    "confirmationNeeded",
    "usedFolder",
    "completed"
  ]);

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegrationAccountApiKey: GetIntegrationAccountApiKey = ({
  formId,
  id
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getAccountProperties,
    hash: api.hash,
    version,
    formId,
    integration: id
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

export const createIntegrationAccount: CreateIntegrationAccount = ({
  formId,
  id,
  data
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.authenticateIntegration,
    hash: api.hash,
    version,
    formId,
    integration: id
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

export const createIntegrationList: CreateIntegrationList = ({
  formId,
  id,
  data
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createIntegrationGroup,
    hash: api.hash,
    version,
    formId,
    integration: id
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(parseJSON)
    .then(res => res);
};

// Email smtp, gmailSmpt
export const getSmtpIntegration: GetIntegration = (...args) =>
  getIntegration(...args);

export const createSmtpIntegration: CreateIntegration = (...args) =>
  createIntegration(...args);

export const updateSmtpIntegration: UpdateSmptIntegration = ({
  formId,
  ...appData
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.updateIntegration,
    hash: api.hash,
    version,
    formId
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(appData)
  })
    .then(parseJSON)
    .then(res => res);
};

// Recaptcha

export const addRecaptcha: AddRecaptcha = ({
  group,
  service,
  secretkey,
  sitekey,
  response
}) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.addAccount,
    hash: api.hash,
    version,
    secretkey,
    response
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      group,
      service,
      sitekey,
      secretkey
    })
  })
    .then(parseJSON)
    .then(res => res);
};
