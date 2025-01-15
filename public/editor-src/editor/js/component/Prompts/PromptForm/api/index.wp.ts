import { Str } from "@brizy/readers";
import _ from "underscore";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import Config, { WP } from "visual/global/Config";
import { request } from "visual/utils/api/index.wp";
import {
  AddRecaptcha,
  CreateForm,
  CreateIntegration,
  CreateIntegrationAccount,
  CreateIntegrationList,
  DeleteSmtpIntegration,
  FormData,
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

  return request(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then((r) => parseJSON<FormData>(r))
    .then((res) => res);
};

export const createForm: CreateForm = ({ formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createForm,
    hash: api.hash,
    version
  });

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ id: formId })
  }).then((r) => parseJSON<FormData>(r));
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ hasEmailTemplate, emailTemplate })
  })
    .then(parseJSON)
    .then((res) => res);
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

  return request(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ id })
  }).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
      accounts: Array<{ id: string; name: string }>;
    } | null>(r)
  );
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

  return request(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((r) => parseJSON<Array<{ name: string }>>(r));
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }).then((r) =>
    parseJSON<{
      id: number;
      type: string;
      name: string;
    } | null>(r)
  );
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }).then((r) =>
    parseJSON<{
      formId: string;
      id: string;
      data: Record<string, string>;
      usedAccount: string;
    }>(r)
  );
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

  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(appData)
  }).then((r) =>
    parseJSON<{
      subject: string;
      emailTo: string;
    } | null>(r)
  );
};

export const deleteSmtpIntegration: DeleteSmtpIntegration = (
  { formId, integration },
  config
) => {
  const {
    api: { url, hash, deleteIntegration }
  } = (config as WP).wp;

  const version = config.editorVersion;
  const reqUrl = makeUrl(url, {
    action: Str.read(deleteIntegration) ?? "",
    hash: hash,
    version,
    formId,
    integration
  });

  return request(reqUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then((r) => parseJSON(r))
    .then((r) => ({ status: r.status, message: "Deleted successfully !" }));
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

  return request(url, {
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
    .then((res) => res);
};
