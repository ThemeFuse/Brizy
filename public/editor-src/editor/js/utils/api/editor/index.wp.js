import _ from "underscore";
import jQuery from "jquery";
import Promise from "promise";
import Config from "visual/global/Config";
import Notifications from "visual/global/Notifications";
import converter from "./converter";

function request(action, data) {
  const apiConfig = Config.get("wp");
  const hash = apiConfig.api.hash;
  const requestUrl = apiConfig.api.url;
  const allData = _.extend({}, data || {}, { action, hash });

  return new Promise((resolve, reject) =>
    jQuery
      .post(requestUrl, allData)
      .done(resolve)
      .fail(function(jqXHR) {
        if (jqXHR.status === 503) {
          // 503 means maintainance
          window.location.reload();
          return;
        }

        Notifications.addNotification({
          id: "request-failed",
          type: Notifications.notificationTypes.error,
          text:
            "Changes could not be saved. Please check your internet connection or try again later.",
          dismissible: true
        });

        reject(jqXHR.responseText);
      })
  );
}

function persistentRequest(ajaxSettings) {
  const apiConfig = Config.get("wp");

  const hash = apiConfig.api.hash;
  const requestUrl = apiConfig.api.url;

  return new Promise(function(resolve, reject) {
    ajaxSettings.data = _.extend(ajaxSettings.data, { hash });

    jQuery.ajax(
      _.extend({ url: requestUrl }, ajaxSettings, {
        notificationId: "data-save-fail",
        onbeforeunload: function() {
          return "You have unsaved data.";
        },
        failedAttempts: 0,
        success: function(data) {
          // Notifications.removeNotification(this.notificationId);
          this.failedAttempts = 0;
          window.onbeforeunload = null;
          resolve(data);
        },
        error: function(jqXHR) {
          // Notifications.addNotification({
          //   id: this.notificationId,
          //   type: Notifications.notificationTypes.error,
          //   text:
          //     "Changes could not be saved. Please check your internet connection.",
          //   dismissible: false
          // });
          this.failedAttempts++;
          window.onbeforeunload = this.onbeforeunload;

          if (this.failedAttempts <= 5) {
            setTimeout(
              function() {
                jQuery.ajax(this);
              }.bind(this),
              5000 * this.failedAttempts
            );
          }
        }
      })
    );
  });
}

export { converter };

export function ping() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.ping, {});
}

export function getPages() {
  const apiConfig = Config.get("wp").api;
  const page = Config.get("wp").page;
  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: { id: page, action: apiConfig.getPage }
  }).then(function(r) {
    return _.map(r, converter.pageFromBackend);
  });
}

export function updatePage(id, data) {
  const apiConfig = Config.get("wp").api;
  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: _.extend({ action: apiConfig.updatePage }, data, { id })
  }).then(converter.pageFromBackend);
}

export function getGlobals() {
  const apiConfig = Config.get("wp").api;
  const page = Config.get("wp").page;

  return persistentRequest({
    type: "POST",
    dataType: "text",
    data: { action: apiConfig.globals.get, id: page }
  }).then(r => JSON.parse(r).gb);
}

export function saveGlobals(data) {
  const apiConfig = Config.get("wp").api;
  const page = Config.get("wp").page;

  return persistentRequest({
    type: "POST",
    dataType: "json",
    data: {
      action: apiConfig.globals.set,
      gb: JSON.stringify(data),
      post: page
    }
  });
}

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

export function getSidebars() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getSidebars, {});
}

export function buildContent(id) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.buildContent, { id });
}

export function sidebarContent(sidebarId) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.sidebarContent, { sidebarId });
}

export function shortcodeContent(shortcode) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.shortcodeContent, { shortcode });
}

export function shortcodeList() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.shortcodeList, {});
}

export function getMenus() {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getMenus, {});
}

export function updatePost() {
  const apiConfig = Config.get("wp").api;
  const post = Config.get("wp").page;
  return request(apiConfig.updatePost, { post });
}

export function getTerms(taxonomy) {
  const apiConfig = Config.get("wp").api;
  return request(apiConfig.getTerms, { taxonomy });
}

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
