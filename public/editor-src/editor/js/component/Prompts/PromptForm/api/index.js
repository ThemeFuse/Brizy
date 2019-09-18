import Config from "visual/global/Config";
import { request2 } from "visual/utils/api/editor";
import { makeUrl, parseJSON } from "../../common/utils/Request";

export const getForm = formId => {
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

export const createForm = ({ body }) => {
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
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateForm = ({ formId, body }) => {
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
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegration = ({ appId, formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getIntegration,
    hash: api.hash,
    version,
    formId,
    integration: appId
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

export const createIntegration = ({ formId, body }) => {
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
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const updateIntegration = ({ formId, body }) => {
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
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegrationAccountApiKey = ({ appId, formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getAccountProperties,
    hash: api.hash,
    version,
    formId,
    integration: appId
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

export const createIntegrationAccount = ({ appId, formId, body }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.authenticateIntegration,
    hash: api.hash,
    version,
    formId,
    integration: appId
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegrationListApiKeys = ({ appId, formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getListProperties,
    hash: api.hash,
    version,
    formId,
    integration: appId
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

export const getIntegrationLists = ({ appId, formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getIntegrationLists,
    hash: api.hash,
    version,
    formId,
    integration: appId
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

export const createIntegrationList = ({ appId, formId, body }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createIntegrationGroup,
    hash: api.hash,
    version,
    formId,
    integration: appId
  });

  return request2(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  })
    .then(parseJSON)
    .then(res => res);
};

export const getIntegrationFields = ({ appId, formId }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.getIntegrationFields,
    hash: api.hash,
    version,
    formId,
    integration: appId
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
