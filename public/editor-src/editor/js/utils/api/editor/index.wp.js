import _ from "underscore";
import jQuery from "jquery";
import Promise from "promise";
import Config from "visual/global/Config";
import {
  parsePage,
  stringifyPage,
  parseGlobals,
  stringifyGlobals
} from "./adapter";

export function request(action, data) {
  const { hash, url } = Config.get("wp").api;
  const data_ = { ...data, action, hash };

  return new Promise((resolve, reject) =>
    jQuery
      .post(url, data_)
      .done(resolve)
      .fail(jqXHR => reject(jqXHR.responseText))
  );
}

export function persistentRequest(ajaxSettings) {
  const { hash, url } = Config.get("wp").api;
  const { data, ...otherSettings } = ajaxSettings;

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      ...otherSettings,
      url,
      data: {
        ...data,
        hash
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

// page

export function getPages() {
  const apiConfig = Config.get("wp").api;
  const page = Config.get("wp").page;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { id: page, action: apiConfig.getPage }
  }).then(r => {
    return r.map(parsePage);
  });
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

// globals

export function getGlobals() {
  const { getGlobals } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: getGlobals }
  }).then(r => {
    return parseGlobals(r.gb);
  });
}

export function updateGlobals(data, meta = {}) {
  const { setGlobals } = Config.get("wp").api;
  const { is_autosave = 1 } = meta;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: setGlobals,
      gb: stringifyGlobals(data),
      is_autosave
    }
  });
}

// global blocks

export function getGlobalBlocks() {
  const { getGlobalBlockList } = Config.get("wp").api;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { action: getGlobalBlockList }
  }).then(r => {
    return r.reduce((acc, block) => {
      acc[block.uid] = JSON.parse(block.data);

      return acc;
    }, {});
  });
}

export function createGlobalBlock({ id, data }) {
  const { createGlobalBlock } = Config.get("wp").api;
  const data_ = JSON.stringify(data);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: createGlobalBlock,
      uid: id,
      data: data_
    }
  });
}

export function updateGlobalBlock({ id, data }, meta = {}) {
  const { updateGlobalBlock } = Config.get("wp").api;
  const { is_autosave = 1 } = meta;
  const data_ = JSON.stringify(data);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: updateGlobalBlock,
      uid: id,
      data: data_,
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
  }).then(r => {
    return r.reduce((acc, block) => {
      acc[block.uid] = JSON.parse(block.data);

      return acc;
    }, {});
  });
}

export function createSavedBlock({ id, data }) {
  const { createSavedBlock } = Config.get("wp").api;
  const data_ = JSON.stringify(data);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: createSavedBlock,
      uid: id,
      data: data_
    }
  });
}

export function updateSavedBlock({ id, data }, meta = {}) {
  const { updateSavedBlock } = Config.get("wp").api;
  const { is_autosave = 0 } = meta;
  const data_ = JSON.stringify(data);

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: updateSavedBlock,
      uid: id,
      data: data_,
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

  return request(apiConfig.downloadMedia, data);
}

export function getImageUid(id) {
  const { api: apiConfig, page } = Config.get("wp");
  const data = {
    post_id: page,
    attachment_id: id
  };

  return request(apiConfig.getMediaUid, data);
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
  return request(apiConfig.getSidebars, {});
}

export function shortcodeContent(shortcode) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.shortcodeContent, { shortcode });
}

export function getMenus() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getMenus, {});
}

export function getTerms(taxonomy) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getTerms, { taxonomy });
}
