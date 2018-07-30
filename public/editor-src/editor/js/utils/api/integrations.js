function createIntegrationUrl(apiUrl) {
  return `${apiUrl}/api/users/${userId}/forms`;
}

function getIntegrationsUrl(apiUrl, formId) {
  return `${apiUrl}/api/users/${userId}/forms/${formId}`;
}

function appEndpoint(apiUrl, appId, formId) {
  return `${apiUrl}/${appId}/api/users/${userId}/forms/${formId}/integration`;
}

function accountsEndpoint(apiUrl, appId) {
  return `${apiUrl}/${appId}/api/users/${userId}/accounts`;
}

const makeRequest = (url, options) => {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });

  return fetch(url, {
    credentials: "same-origin",
    headers,
    ...options
  }).then(response => {
    return response.json();
  });
};

export const getIntegrationAccount = (appId, { apiUrl }) => {
  return makeRequest(accountsEndpoint(apiUrl, appId), { method: "GET" });
};

export const deleteIntegrationAccount = (appId, { apiUrl, account }) => {
  return makeRequest(accountsEndpoint(apiUrl, appId) + `/${account}`, {
    method: "DELETE"
  });
};

export const getIntegrations = (formId, { apiUrl }) => {
  return makeRequest(getIntegrationsUrl(apiUrl, formId), {
    method: "GET"
  });
};

export const createIntegrations = (formId, { apiUrl, body }) => {
  return makeRequest(createIntegrationUrl(apiUrl), {
    method: "POST",
    body: JSON.stringify(body)
  });
};

export const getIntegration = (appId, { apiUrl, formId }) => {
  return makeRequest(appEndpoint(apiUrl, appId, formId), { method: "GET" });
};

export const createIntegration = (appId, { apiUrl, formId }) => {
  return makeRequest(appEndpoint(apiUrl, appId, formId), { method: "POST" });
};

export const updateIntegration = (appId, { apiUrl, formId, body }) => {
  return makeRequest(appEndpoint(apiUrl, appId, formId), {
    method: "PUT",
    body: JSON.stringify(body)
  });
};

export const getIntegrationAccountLists = (appId, { apiUrl, account }) => {
  return makeRequest(accountsEndpoint(apiUrl, appId) + `/${account}/lists`, {
    method: "GET"
  });
};

export const getIntegrationAccountFields = (
  appId,
  { apiUrl, account, list }
) => {
  return makeRequest(
    accountsEndpoint(apiUrl, appId) + `/${account}/lists/${list}/fields`,
    { method: "GET" }
  );
};

export const getIntegrationFields = (appId, account) => {
  // Temporary
  console.warn(`getIntegrationFields not implemented ${appId}`);
  return [];
  return makeRequest(accountsEndpoint(appId) + `/${account}/fields`, {
    method: "GET"
  });
};

// For Wordpress
export const getWpIntegrations = (formId, { wpApiUrl }) => {
  return makeRequest(`${wpApiUrl}?action=brizy_get_form&form_id=${formId}`, {
    method: "GET"
  });
};

export const getWpIntegrationDefault = wpApiUrl => {
  return makeRequest(`${wpApiUrl}?action=brizy_default_form`, {
    method: "GET"
  });
};

export const updateWpIntegration = (formId, { wpApiUrl, body }) => {
  return makeRequest(`${wpApiUrl}?action=brizy_create_form`, {
    method: "POST",
    body: `form=${JSON.stringify(body)}`
  });
};

export const updateWpFormIntegrations = (formId, { wpApiUrl, body }) => {
  return makeRequest(
    `${wpApiUrl}?action=brizy_form_integration_status&form_id=${formId}`,
    {
      method: "POST",
      body: `has_integrations=${JSON.stringify(body)}`
    }
  );
};
