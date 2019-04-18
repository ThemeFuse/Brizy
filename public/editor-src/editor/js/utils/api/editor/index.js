import _ from "underscore";
import jQuery from "jquery";
import Config from "visual/global/Config";
import {
  parsePage,
  stringifyPage,
  parseGlobals,
  stringifyGlobals
} from "./adapter";

const hardcodedAjaxSettings = {
  xhrFields: {
    withCredentials: true
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        beforeSend(xhr) {
          xhr.setRequestHeader("x-auth-user-token", Config.get("accessToken"));
        }
      }
    : {})
};

export function request(ajaxSettings) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      ...hardcodedAjaxSettings,
      ...ajaxSettings,
      success(data) {
        resolve(data);
      },
      error(jqXHR) {
        reject(jqXHR.responseText);
      }
    });
  });
}

export function persistentRequest(ajaxSettings) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      ...hardcodedAjaxSettings,
      ...ajaxSettings,
      onbeforeunload() {
        return "You have unsaved data.";
      },
      failedAttempts: 0,
      success(data) {
        this.failedAttempts = 0;
        window.onbeforeunload = null;
        resolve(data);
      },
      error(jqXHR) {
        this.failedAttempts++;
        window.onbeforeunload = this.onbeforeunload;

        if (this.failedAttempts <= 5) {
          setTimeout(() => jQuery.ajax(this), 5000 * this.failedAttempts);
        } else {
          reject(jqXHR);
        }
      }
    });
  });
}

const apiUrl = Config.get("urls").api;
const paginationData = {
  page: 1,
  count: 200
};
const uidToApiId = {};

// page

export function getPages() {
  const project = Config.get("project").id;
  const requestData = {
    project,
    ...paginationData
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/pages",
    data: requestData
  }).then(r => {
    return r.map(parsePage);
  });
}

export function createPage(data, meta = {}) {
  const { is_autosave = 0 } = meta;
  const requestData = {
    ...data,
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/pages",
    data: requestData
  }).then(r => {
    return parsePage(r);
  });
}

export function updatePage(page, meta = {}) {
  const { id, data, is_index, status } = stringifyPage(page);
  const { is_autosave = 1 } = meta;
  const requestData = {
    data,
    is_index,
    status,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/pages/" + id,
    data: requestData
  });
}

export function deletePage(id) {
  return persistentRequest({
    type: "DELETE",
    dataType: "json",
    url: apiUrl + "/pages/" + id
  });
}

// globals

export function getGlobals() {
  const project = Config.get("project").id;

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/projects/" + project
  }).then(r => {
    return parseGlobals(r.globals);
  });
}

export function updateGlobals(data, meta = {}) {
  const project = Config.get("project").id;
  const { is_autosave = 1 } = meta;
  const requestData = {
    globals: stringifyGlobals(data),
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/projects/" + project,
    data: requestData
  });
}

// global blocks

export function getGlobalBlocks() {
  const project = Config.get("project").id;
  const requestData = {
    ...paginationData,
    project
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/global_blocks",
    data: requestData
  }).then(r => {
    return r.reduce((acc, { id, uid, data }) => {
      // map uids to ids to use them in updates
      uidToApiId[uid] = id;

      acc[uid] = JSON.parse(data);

      return acc;
    }, {});
  });
}

export function createGlobalBlock({ id: uid, data }, meta = {}) {
  const project = Config.get("project").id;
  const { is_autosave = 0 } = meta;
  const requestData = {
    uid,
    project,
    data: JSON.stringify(data),
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/global_blocks",
    data: requestData
  }).then(r => {
    // map our uid to the newly created block's id
    uidToApiId[uid] = r.id;
  });
}

export function updateGlobalBlock({ id: uid, data }, meta = {}) {
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = meta;
    const requestData = {
      uid,
      data: JSON.stringify(data),
      is_autosave
    };

    return persistentRequest({
      type: "PUT",
      dataType: "json",
      url: apiUrl + "/global_blocks/" + uidToApiId[uid],
      data: requestData
    });
  } else {
    // need some kind of retry mechanism
    return Promise.reject("not implemented yet");
  }
}

// saved blocks

export function getSavedBlocks() {
  const library = Config.get("library").id;
  const requestData = {
    ...paginationData,
    library
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/saved_blocks",
    data: requestData
  }).then(r => {
    return r.reduce((acc, { id, uid, data }) => {
      // map uids to ids to use them in updates
      uidToApiId[uid] = id;

      acc[uid] = JSON.parse(data);

      return acc;
    }, {});
  });
}

export function createSavedBlock({ id: uid, data }, meta = {}) {
  const library = Config.get("library").id;
  const { is_autosave = 0 } = meta;
  const requestData = {
    uid,
    library,
    data: JSON.stringify(data),
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/saved_blocks",
    data: requestData
  }).then(r => {
    // map our uid to the newly created block's id
    uidToApiId[uid] = r.id;
  });
}

export function updateSavedBlock({ id: uid, data }, meta = {}) {
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = meta;
    const requestData = {
      uid,
      data: JSON.stringify(data),
      is_autosave
    };

    return persistentRequest({
      type: "PUT",
      dataType: "json",
      url: apiUrl + "/saved_blocks/" + uidToApiId[uid],
      data: requestData
    });
  } else {
    // need some kind of retry mechanism
    return Promise.reject("not implemented yet");
  }
}

export function deleteSavedBlock({ id: uid }) {
  if (uidToApiId[uid]) {
    return persistentRequest({
      type: "DELETE",
      dataType: "json",
      url: apiUrl + "/saved_blocks/" + uidToApiId[uid]
    });
  } else {
    // need some kind of retry mechanism
    return Promise.reject("not implemented yet");
  }
}

// image

export function uploadImage(data) {
  const requestData = {
    attachment: data.base64
  };

  return request({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/media",
    data: requestData
  });
}
