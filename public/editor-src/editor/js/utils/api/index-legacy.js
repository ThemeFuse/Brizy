import jQuery from "jquery";
import { compose } from "underscore";
import Config from "visual/global/Config";
import {
  parseExternalStory,
  parseExternalPopup,
  stringifyPage,
  parseProject,
  stringifyProject,
  parseGlobalBlock,
  stringifyGlobalBlock
} from "./adapter";
import * as Response from "./response";
import { apiUrl, paginationData } from "./const";

const hardcodedAjaxSettings = {
  xhrFields: {
    withCredentials: true
  },
  beforeSend(xhr) {
    xhr.setRequestHeader("x-editor-version", Config.get("editorVersion"));

    if (TARGET === "Cloud-localhost") {
      xhr.setRequestHeader("x-auth-user-token", Config.get("tokenV1"));
    }
  }
};
const uidToApiId = {};

export function request(ajaxSettings) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      ...hardcodedAjaxSettings,
      ...ajaxSettings,
      success: resolve,
      error: compose(reject, Response.fromJqXHR)
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
        const status = jqXHR.status;

        // 0   - offline
        // 503 - service unavailable
        if (status === 0 || status === 503) {
          this.failedAttempts++;
          window.onbeforeunload = this.onbeforeunload;

          if (this.failedAttempts <= 5) {
            setTimeout(() => jQuery.ajax(this), 5000 * this.failedAttempts);
          }
        } else {
          reject(jqXHR);
        }
      }
    });
  });
}

// a thin wrapper around fetch
export function request2(url, config = {}) {
  if (TARGET === "Cloud-localhost") {
    return fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": Config.get("editorVersion"),
        "x-auth-user-token": Config.get("tokenV1")
      }
    });
  } else {
    return fetch(url, {
      credentials: "same-origin",
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": Config.get("editorVersion")
      }
    });
  }
}

// pending request

export function pendingRequest(time = 650) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
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
  const { data, dataVersion } = stringifyProject(project);
  const requestData = {
    data,
    dataVersion,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/projects/" + projectId,
    data: requestData
  });
}

export function addProjectLockedBeacon() {
  const projectId = Config.get("project").id;
  return request2(`${apiUrl}/projects/${projectId}/locks`, {
    method: "POST"
  });
}

export function removeProjectLockedSendBeacon() {
  const projectId = Config.get("project").id;
  return navigator.sendBeacon(`${apiUrl}/projects/${projectId}/remove_locks`);
}

// popups
export function getExternalPopups() {
  const project = Config.get("project").id;
  const requestData = {
    project,
    ...paginationData
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/external_popups",
    data: requestData
  }).then(r => {
    return r.map(parseExternalPopup);
  });
}

// external story
export function getExternalStories() {
  const project = Config.get("project").id;
  const requestData = {
    project,
    ...paginationData
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/external_stories",
    data: requestData
  }).then(r => {
    return r.map(parseExternalStory);
  });
}

export function updateExternalStories(story, meta = {}) {
  const { id, data, dataVersion, status } = stringifyPage(story);
  const { is_autosave = 1 } = meta;
  const requestData = {
    data,
    dataVersion,
    status,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/external_stories/" + id,
    data: requestData
  });
}

export function createExternalStory(data, meta = {}) {
  const { is_autosave = 0 } = meta;
  const requestData = {
    ...data,
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/external_stories",
    data: requestData
  }).then(r => {
    return parseExternalStory(r);
  });
}

export function createExternalPopup(data, meta = {}) {
  const { is_autosave = 0 } = meta;
  const requestData = {
    ...data,
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/external_popups",
    data: requestData
  }).then(r => {
    return parseExternalPopup(r);
  });
}

export function updateExternalPopup(popup, meta = {}) {
  const { id, data, dataVersion, status } = stringifyPage(popup);
  const { is_autosave = 1 } = meta;
  const requestData = {
    data,
    dataVersion,
    status,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/external_popups/" + id,
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
    return r
      .map(parseGlobalBlock)
      .reduce(
        (
          acc,
          { id, uid, data, meta, rules, position, status, dataVersion }
        ) => {
          // map uids to ids to use them in updates
          uidToApiId[uid] = id;

          acc[uid] = {
            id: uid,
            data,
            meta,
            rules,
            position,
            status,
            dataVersion
          };

          return acc;
        },
        {}
      );
  });
}

export function createGlobalBlock(globalBlock) {
  const uid = globalBlock.data.value._id;
  const { data, rules, meta, status, dataVersion } = stringifyGlobalBlock(
    globalBlock
  );
  const projectId = Config.get("project").id;
  const requestData = {
    project: projectId,
    is_autosave: 0,
    uid,
    status,
    data,
    dataVersion,
    rules,
    meta
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/global_blocks",
    data: requestData
  }).then(r => {
    // map our uid to the newly created block's id
    uidToApiId[uid] = r.id;
    return r;
  });
}

export function updateGlobalBlock(uid, globalBlock, extraMeta = {}) {
  // const uid = globalBlock.data.value._id;

  const { data, rules, meta, dataVersion } = stringifyGlobalBlock(globalBlock);
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = extraMeta;
    const requestData = {
      uid,
      data,
      rules,
      dataVersion,
      meta,
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

export function updateGlobalBlocks(globalBlocks, extraMeta = {}) {
  const { is_autosave = 1 } = extraMeta;
  const data = Object.entries(globalBlocks).reduce(
    (acc, [uid, globalBlock]) => {
      const {
        data,
        rules,
        position,
        dataVersion,
        meta,
        status
      } = stringifyGlobalBlock(globalBlock);

      acc.push({
        id: uidToApiId[uid],
        status,
        data,
        position: JSON.stringify(position),
        dataVersion,
        rules,
        meta
      });

      return acc;
    },
    []
  );

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/global_block/bulk",
    data: { data, is_autosave }
  });
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

export async function uploadFile(file) {
  const project = Config.get("project").id;
  const base64 = await toBase64(file);
  const attachment = base64.replace(/.+;base64,/, "");

  return request2(`${apiUrl}/custom_files `, {
    method: "POST",
    body: new URLSearchParams({
      attachment,
      project,
      filename: file.name
    })
  })
    .then(r => r.json())
    .then(value => value);

  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}

// heartBeat

export function sendHeartBeat() {
  const projectId = Config.get("project").id;
  return request2(`${apiUrl}/projects/${projectId}/pings`, {
    method: "POST"
  }).then(r => r.json());
}

export function sendHearBeatTakeOver() {
  const projectId = Config.get("project").id;
  return request2(`${apiUrl}/projects/${projectId}/take_overs`, {
    method: "POST"
  });
}

/**
 * @param {string} type
 * @return {Promise<{posts:[]}[]>}
 */
// eslint-disable-next-line no-unused-vars
export const getPostObjects = async (type = undefined) => [];
