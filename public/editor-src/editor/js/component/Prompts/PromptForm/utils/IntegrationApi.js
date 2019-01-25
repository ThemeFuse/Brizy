import Config from "visual/global/Config";
import makeRequest from "./Request";

export const fakeLoading = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 650);
  });

export const getForm = formId => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      formId,
      action: api.getForm,
      hash: api.hash
    }
  });
};

export const createForm = ({ body }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.createForm,
      hash: api.hash
    },
    body: JSON.stringify(body)
  });
};

export const getIntegration = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getIntegration,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};

export const createIntegration = ({ formId, body }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.createIntegration,
      hash: api.hash,
      formId
    },
    body: JSON.stringify(body)
  });
};

export const updateIntegration = ({ formId, body }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.updateIntegration,
      hash: api.hash,
      formId
    },
    body: JSON.stringify(body)
  });
};

export const getIntegrationAccountApiKey = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getAccountProperties,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};

export const createIntegrationAccount = ({ appId, formId, body }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.authenticateIntegration,
      hash: api.hash,
      formId,
      integration: appId
    },
    body: JSON.stringify(body)
  });
};

export const getIntegrationListApiKeys = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getListProperties,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};

export const getIntegrationLists = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getIntegrationLists,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};

export const createIntegrationList = ({ appId, formId, body }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.createIntegrationGroup,
      hash: api.hash,
      formId,
      integration: appId
    },
    body: JSON.stringify(body)
  });
};

export const getIntegrationFields = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "GET",
    url: api.url,
    queryParams: {
      action: api.getIntegrationFields,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};

export const getAuthIntegrationUrl = ({ appId, formId }) => {
  const { api } = Config.get("wp");

  return makeRequest({
    method: "POST",
    url: api.url,
    queryParams: {
      action: api.authenticateIntegration,
      hash: api.hash,
      formId,
      integration: appId
    }
  });
};
