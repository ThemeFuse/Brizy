import jQuery from "jquery";
import Promise from "promise";
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
      ...otherSettings,
      url,
      data: {
        ...data,
        hash,
        version
      },
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
  const { lockProject } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(apiUrl, {
    method: "POST",
    body: new URLSearchParams({
      version,
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
  }).then(({ data }) => data.map(parsePage));
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

export function updateRules(data) {
  const {
    api: { updateRules, hash, url },
    page
  } = Config.get("wp");
  const { rules, dataVersion } = data;
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
    credentials: "same-origin",
    body: new URLSearchParams({
      action: getRuleList,
      hash,
      post: page,
      version
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
      .reduce((acc, { uid, data, dataVersion }) => {
        acc[uid] = { id: uid, data, dataVersion };

        return acc;
      }, {});
  });
}

export function createGlobalBlock(globalBlock) {
  const { createGlobalBlock } = Config.get("wp").api;
  const { id: uid, data, dataVersion } = stringifyGlobalBlock(globalBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: createGlobalBlock,
      uid,
      data,
      dataVersion
    }
  });
}

export function updateGlobalBlock(globalBlock, meta = {}) {
  const { updateGlobalBlock } = Config.get("wp").api;
  const { is_autosave = 1 } = meta;
  const { id: uid, data, dataVersion } = stringifyGlobalBlock(globalBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: updateGlobalBlock,
      uid,
      data,
      dataVersion,
      is_autosave
    }
  });
}

// saved blocks

export function getSavedBlocks() {
  const { getSavedBlockList } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: getSavedBlockList }
  }).then(({ data }) => {
    return data
      .map(parseSavedBlock)
      .reduce((acc, { uid, data, dataVersion }) => {
        acc[uid] = { uid, data, dataVersion };

        return acc;
      }, {});
  });
}

export function createSavedBlock(savedBlock) {
  const { createSavedBlock } = Config.get("wp").api;
  const { id: uid, data, dataVersion } = stringifySavedBlock(savedBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: createSavedBlock,
      uid,
      data,
      dataVersion
    }
  });
}

export function updateSavedBlock(savedBlock, meta = {}) {
  const { updateSavedBlock } = Config.get("wp").api;
  const { is_autosave = 0 } = meta;
  const { id: uid, data, dataVersion } = stringifySavedBlock(savedBlock);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: updateSavedBlock,
      uid,
      data,
      dataVersion,
      is_autosave
    }
  });
}

export function deleteSavedBlock({ id }) {
  const { deleteSavedBlock } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: deleteSavedBlock, uid: id }
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

export function getTerms(taxonomy) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getTerms, { taxonomy }).then(({ data }) => data);
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

// screenshots

export function createBlockScreenshot({ base64, blockType }) {
  const {
    page,
    api: { createBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(apiUrl, {
    method: "POST",
    credentials: "omit",
    body: new URLSearchParams({
      action: createBlockScreenshot,
      post: page,
      block_type: blockType,
      ibsf: attachment,
      version
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

export function updateBlockScreenshot({ id, base64, blockType }) {
  const {
    page,
    api: { updateBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(apiUrl, {
    method: "POST",
    credentials: "omit",
    body: new URLSearchParams({
      action: updateBlockScreenshot,
      post: page,
      block_type: blockType,
      id,
      ibsf: attachment,
      version
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

// dynamic content

export function getDynamicContent({ placeholder, signal }) {
  const {
    page,
    api: { placeholderContent }
  } = Config.get("wp");
  const version = Config.get("editorVersion");

  return request2(apiUrl, {
    method: "POST",
    body: new URLSearchParams({
      action: placeholderContent,
      version,
      post_id: page,
      placeholder
    }),
    signal
  })
    .then(r => {
      if (!r.ok) {
        // TODO: add proper error handling
        throw new Error("fetch dynamic content error");
      }

      return r.json();
    })
    .then(rj => {
      if (rj.success) {
        return rj.data.placeholder;
      } else {
        // TODO: add proper error handling
        throw new Error("fetch dynamic content error");
      }
    });
}

export function getPostObjects(postType) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getPostObjects, { postType }).then(
    ({ data }) => data
  );
}

export function getConditions() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getRuleGroupList, { context: "popup-rules" }).then(
    ({ data }) => data
  );
}

// heartBeat
export function sendHeartBeat() {
  const { heartBeat } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(apiUrl, {
    method: "POST",
    body: new URLSearchParams({
      version,
      action: heartBeat
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
  const { takeOver } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request2(apiUrl, {
    method: "POST",
    body: new URLSearchParams({
      version,
      action: takeOver
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
