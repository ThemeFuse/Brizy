import jQuery from "jquery";
import Promise from "promise";
import Config from "visual/global/Config";
import {
  parsePageWP,
  stringifyPage,
  parseProject,
  stringifyProject,
  parseGlobalBlock,
  stringifyGlobalBlock
} from "./adapter";
import { makeBlockMeta } from "./adapter";

const apiUrl = Config.get("wp").api.url;

export function request(action, data) {
  const { hash, url } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const data_ = { ...data, action, hash, version };

  return new Promise((resolve, reject) =>
    jQuery
      .post(url, data_)
      .done(resolve)
      .fail(jqXHR => reject(jqXHR.responseText))
  );
}

export function persistentRequest(ajaxSettings) {
  const { hash, url } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const { data, ...otherSettings } = ajaxSettings;

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url,
      ...otherSettings,
      data:
        typeof data === "object" && data !== null
          ? {
              ...data,
              hash,
              version
            }
          : data,
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
        const { status, responseJSON } = jqXHR;

        // 0 - offline
        if (status === 0) {
          this.failedAttempts++;
          window.onbeforeunload = this.onbeforeunload;

          if (this.failedAttempts <= 5) {
            setTimeout(() => jQuery.ajax(this), 5000 * this.failedAttempts);
          }
        } else {
          reject(responseJSON);
        }
      }
    });
  });
}

// a thin wrapper around fetch
export function request2(url, config = {}) {
  // will see later if we'll have to hardcode
  // some settings into config like we do for brizy cloud
  return fetch(url, config);
}

// pending request

export function pendingRequest(time = 650) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

// project

export function getProject() {
  const { getProject } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: getProject }
  })
    .then(({ data }) => data)
    .then(parseProject);
}

export function updateProject(project, meta = {}) {
  const { setProject } = Config.get("wp").api;
  const { is_autosave = 1 } = meta;
  const { data, dataVersion } = stringifyProject(project);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      data,
      dataVersion,
      is_autosave,
      action: setProject
    }
  });
}

export function addProjectLockedBeacon() {
  const { url, hash, lockProject } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      version,
      hash,
      action: lockProject
    })
  })
    .then(r => r.json())
    .then(rj => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}

export function removeProjectLockedSendBeacon() {
  const { removeLock } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const url = new URL(apiUrl);

  url.searchParams.append("action", removeLock);
  url.searchParams.append("version", version);

  return navigator.sendBeacon(`${url}`);
}

// page

export function getPages() {
  const apiConfig = Config.get("wp").api;
  const page = Config.get("wp").page;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { id: page, action: apiConfig.getPage }
  }).then(({ data }) => data.map(parsePageWP));
}

export function getPage(pageId) {
  return getPages().then(pages => pages.find(p => p.id === pageId));
}

export function updatePage(page, meta = {}) {
  const { updatePage } = Config.get("wp").api;
  const { is_autosave = 1 } = meta;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: updatePage,
      ...stringifyPage(page),
      is_autosave
    }
  });
}

// rules changes

export function updatePopupRules(popup) {
  const {
    api: { updateRules, hash, url },
    page
  } = Config.get("wp");
  const { rules, dataVersion } = popup;
  const version = Config.get("editorVersion");

  return request2(
    `${url}?action=${updateRules}&hash=${hash}&post=${page}&version=${version}&dataVersion=${dataVersion}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rules)
    }
  );
}

export function getRulesList() {
  const {
    api: { getRuleList, hash, url },
    page
  } = Config.get("wp");
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      action: getRuleList,
      post: page,
      version,
      hash
    })
  })
    .then(r => r.json())
    .then(({ data }) => data);
}

// global blocks

export function getGlobalBlocks() {
  const { getGlobalBlockList } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: getGlobalBlockList }
  }).then(({ data }) => {
    return data
      .map(parseGlobalBlock)
      .reduce(
        (acc, { uid, data, status, dataVersion, rules, position, meta }) => {
          if (status === "draft") return acc;

          acc[uid] = {
            data,
            status,
            dataVersion,
            meta,
            rules,
            position,
            id: uid
          };

          return acc;
        },
        {}
      );
  });
}

export function createGlobalBlock(globalBlock) {
  const { createGlobalBlock } = Config.get("wp").api;
  const uid = globalBlock.data.value._id;
  const { data, rules, dataVersion, meta } = stringifyGlobalBlock(globalBlock);
  const media = makeBlockMeta(globalBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      uid,
      status: "draft",
      data,
      dataVersion,
      rules,
      meta,
      media,
      action: createGlobalBlock
    }
  });
}

export function updateGlobalBlock(uid, globalBlock, extraMeta = {}) {
  const { updateGlobalBlock } = Config.get("wp").api;
  const { is_autosave = 1 } = extraMeta;
  // const uid = globalBlock.data.value._id;
  const { data, rules, dataVersion, meta, status } = stringifyGlobalBlock(
    globalBlock
  );

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      uid,
      status,
      data,
      dataVersion,
      rules,
      is_autosave,
      meta,
      action: updateGlobalBlock
    }
  });
}

export function updateGlobalBlocks(globalBlocks, extraMeta = {}) {
  const { updateGlobalBlocks } = Config.get("wp").api;
  const { is_autosave = 1 } = extraMeta;

  const data = Object.entries(globalBlocks).reduce(
    (acc, [uid, globalBlock]) => {
      const {
        data,
        position,
        rules,
        dataVersion,
        meta,
        status
      } = stringifyGlobalBlock(globalBlock);

      acc.uid.push(uid);
      acc.status.push(status);
      acc.data.push(data);
      acc.position.push(JSON.stringify(position));
      acc.dataVersion.push(dataVersion);
      acc.rules.push(rules);
      acc.meta.push(meta);

      return acc;
    },
    {
      uid: [],
      status: [],
      data: [],
      position: [],
      dataVersion: [],
      rules: [],
      meta: []
    }
  );

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      uid: data.uid,
      status: data.status,
      data: data.data,
      position: data.position,
      dataVersion: data.dataVersion,
      rules: data.rules,
      is_autosave,
      meta: data.meta,
      action: updateGlobalBlocks
    }
  });
}

export function updateGlobalBlocksPositions(data, extraMeta = {}) {
  const { updateBlockPositions, hash, url } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const { is_autosave = 1 } = extraMeta;

  return persistentRequest({
    type: "POST",
    url: `${url}?action=${updateBlockPositions}&hash=${hash}&is_autosave=${is_autosave}&version=${version}`,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(data)
  });
}

// image

export function downloadImageFromCloud(id) {
  const { api: apiConfig, page } = Config.get("wp");
  const data = {
    post_id: page,
    media: id
  };

  return request(apiConfig.downloadMedia, data).then(({ data }) => data);
}

export function getImageUid(id) {
  const { api: apiConfig, page } = Config.get("wp");
  const data = {
    post_id: page,
    attachment_id: id
  };

  return request(apiConfig.getMediaUid, data).then(({ data }) => data);
}

// featured image

export function updateFeaturedImage(post, attachmentId) {
  const apiConfig = Config.get("wp").api;

  return request(apiConfig.setFeaturedImage, {
    post,
    attachmentId
  });
}

export function updateFeaturedImageFocalPoint(
  post,
  attachmentId,
  pointX,
  pointY
) {
  const apiConfig = Config.get("wp").api;

  return request(apiConfig.setFeaturedImageFocalPoint, {
    post,
    attachmentId,
    pointX,
    pointY
  });
}

export function removeFeaturedImage(post) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.removeFeaturedImage, { post });
}

// other

export function getSidebars() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getSidebars, {}).then(({ data }) => data);
}

export function shortcodeContent(shortcode) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.shortcodeContent, { shortcode }).then(
    ({ data }) => data
  );
}

export function getMenus() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getMenus, {}).then(({ data }) => data);
}

export function getUploadedFonts() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getFonts, {}).then(({ data }) => data);
}

export function getAttachmentById(id) {
  const apiConfig = Config.get("wp").api;
  const data = {
    attachment_id: id
  };

  return request(apiConfig.getAttachmentUid, data).then(({ data }) => data);
}

export function getPostObjects(postType) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getPostObjects, { postType }).then(
    ({ data }) => data
  );
}

export function getGroupList() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getRuleGroupList, { context: "popup-rules" }).then(
    ({ data }) => data
  );
}

// heartBeat
export function sendHeartBeat() {
  const { url, hash, heartBeat } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      action: heartBeat,
      version,
      hash
    })
  })
    .then(r => r.json())
    .then(rj => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}

// take over
export function sendHearBeatTakeOver() {
  const { url, hash, takeOver } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(url, {
    method: "POST",
    body: new URLSearchParams({
      action: takeOver,
      version,
      hash
    })
  })
    .then(r => r.json())
    .then(rj => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}
