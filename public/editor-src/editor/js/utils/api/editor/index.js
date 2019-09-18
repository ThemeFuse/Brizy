import jQuery from "jquery";
import Config from "visual/global/Config";
import {
  parsePage,
  stringifyPage,
  parseProject,
  stringifyProject,
  parseGlobalBlock,
  stringifyGlobalBlock,
  parseSavedBlock,
  stringifySavedBlock
} from "./adapter";

const apiUrl = Config.get("urls").api;
const paginationData = {
  page: 1,
  count: 200
};
const hardcodedAjaxSettings = {
  xhrFields: {
    withCredentials: true
  },
  beforeSend(xhr) {
    xhr.setRequestHeader("x-editor-version", Config.get("editorVersion"));

    if (process.env.NODE_ENV === "development") {
      xhr.setRequestHeader("x-auth-user-token", Config.get("accessToken"));
    }
  }
};
const uidToApiId = {};

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

// a thin wrapper around fetch
export function request2(url, config = {}) {
  const defaultHeaders = {
    "x-editor-version": Config.get("editorVersion")
  };

  if (process.env.NODE_ENV === "development") {
    return fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        ...defaultHeaders,
        "x-auth-user-token": Config.get("accessToken")
      }
    });
  } else {
    return fetch(url, {
      credentials: "same-origin",
      ...config,
      headers: {
        ...config.headers,
        ...defaultHeaders
      }
    });
  }
}

// Project

export function getProject() {
  const project = Config.get("project").id;

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/projects/" + project
  }).then(parseProject);
}

export function updateProject(project, meta = {}) {
  const projectId = Config.get("project").id;
  const { is_autosave = 1 } = meta;
  const { data } = stringifyProject(project);
  const requestData = {
    data,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/projects/" + projectId,
    data: requestData
  });
}

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
    return r.map(parseGlobalBlock).reduce((acc, { id, uid, data }) => {
      // map uids to ids to use them in updates
      uidToApiId[uid] = id;

      acc[uid] = data;

      return acc;
    }, {});
  });
}

export function createGlobalBlock(globalBlock, meta = {}) {
  const { id: uid, data } = stringifyGlobalBlock(globalBlock);
  const projectId = Config.get("project").id;
  const { is_autosave = 0 } = meta;
  const requestData = {
    uid,
    project: projectId,
    data,
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

export function updateGlobalBlock(globalBlock, meta = {}) {
  const { id: uid, data } = stringifyGlobalBlock(globalBlock);
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = meta;
    const requestData = {
      uid,
      data,
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
    return r.map(parseSavedBlock).reduce((acc, { id, uid, data }) => {
      // map uids to ids to use them in updates
      uidToApiId[uid] = id;

      acc[uid] = data;

      return acc;
    }, {});
  });
}

export function createSavedBlock(savedBlock, meta = {}) {
  const { id: uid, data } = stringifySavedBlock(savedBlock);
  const libraryId = Config.get("library").id;
  const { is_autosave = 0 } = meta;
  const requestData = {
    uid,
    library: libraryId,
    data,
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

export function updateSavedBlock(savedBlock, meta = {}) {
  const { id: uid, data } = stringifySavedBlock(savedBlock);
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = meta;
    const requestData = {
      uid,
      data,
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

// fonts

export function getUploadedFonts() {
  const { api } = Config.get("urls");

  // mapped uid cloud to font id what used in models
  return request2(`${api}/fonts`, {
    method: "GET"
  })
    .then(r => r.json())
    .then(r => r.map(({ uid, ...data }) => ({ ...data, id: uid })));
}

// screenshots

export function createBlockScreenshot({ base64 }) {
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(`${apiUrl}/screenshots`, {
    method: "POST",
    body: new URLSearchParams({
      attachment
    })
  }).then(r => r.json());
}

export function updateBlockScreenshot({ id, base64 }) {
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(`${apiUrl}/screenshots/${id}`, {
    method: "PUT",
    body: new URLSearchParams({
      attachment
    })
  }).then(r => r.json());
}
