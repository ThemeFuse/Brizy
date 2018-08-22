import _ from "underscore";
import jQuery from "jquery";
import Config from "visual/global/Config";
import converter from "./converter";

const hardcodedAjaxSettings = {
  xhrFields: {
    withCredentials: true
  },
  beforeSend: function(xhr) {
    if (process.env.NODE_ENV === "development") {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + Config.get("accessToken")
      );
    }
  }
};

function request(ajaxSettings) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax(
      _.extend({}, hardcodedAjaxSettings, ajaxSettings, {
        success: function(data) {
          resolve(data);
        },
        error: function(jqXHR) {
          if (jqXHR.status === 503) {
            // 503 means maintainance
            window.location.reload();
            return;
          }
          reject(jqXHR.responseText);
        }
      })
    );
  });
  return Promise.resolve(
    jQuery.ajax(_.extend({}, hardcodedAjaxSettings, ajaxSettings))
  );
}

function persistentRequest(ajaxSettings) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax(
      _.extend({}, hardcodedAjaxSettings, ajaxSettings, {
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

function getApiUrl() {
  return Config.get("urls").api;
}

function getProjectsApiUrl() {
  return Config.get("urls").api + "/projects/" + Config.get("project");
}

function getLanguageData() {
  return {
    language: Config.get("projectLanguage").id
  };
}

function getPaginationData() {
  return {
    page: 1,
    count: 200
  };
}

export { converter };

export function ping() {
  return request({
    type: "GET",
    dataType: "json",
    url: getApiUrl()
  });
}

export function getPages() {
  var requestData = _.extend(getLanguageData(), getPaginationData());
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: getProjectsApiUrl() + "/pages",
    data: requestData
  }).then(r => _.map(r, converter.pageFromBackend));
}

export function addPage(data) {
  var requestData = _.extend(converter.pageToBackend(data), getLanguageData());
  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: getProjectsApiUrl() + "/pages",
    data: requestData
  }).then(converter.pageFromBackend);
}

export function updatePage(id, data) {
  var requestData = _.extend(
    _.pick(
      converter.pageToBackend(data),
      "title",
      "slug",
      "data",
      "description",
      "is_index",
      "type",
      "url"
    ),
    getLanguageData()
  );
  return persistentRequest({
    type: "PUT",
    url: getProjectsApiUrl() + "/pages/" + id,
    data: requestData
  }).then(converter.pageFromBackend);
}

export function deletePage(id) {
  return persistentRequest({
    type: "DELETE",
    dataType: "json",
    url: getProjectsApiUrl() + "/pages/" + id
  });
}

export function getGlobals() {
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: getProjectsApiUrl(),
    data: getLanguageData()
  }).then(r => JSON.parse(r.globals));
}

export function saveGlobals(data) {
  var requestData = _.extend(
    { globals: JSON.stringify(data) },
    getLanguageData()
  );
  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: getProjectsApiUrl(),
    data: requestData
  });
}

export function getVariants() {
  var requestData = getPaginationData();
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: getProjectsApiUrl() + "/variants",
    data: requestData
  });
}

export function cloneVariant(id) {
  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: getProjectsApiUrl() + "/variants/" + id + "/clones"
  });
}

export function uploadImage(data) {
  var requestData = converter.imageToBackend(data);
  return request({
    type: "POST",
    dataType: "json",
    url: getProjectsApiUrl() + "/media",
    data: requestData
  });
}

export function uploadFile(file) {
  return request({
    type: "POST",
    dataType: "json",
    contentType: false,
    processData: false,
    url: getProjectsApiUrl() + "/custom_files",
    data: file
  });
}

export function getProjectLanguages() {
  var requestData = getPaginationData();
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: getProjectsApiUrl() + "/languages",
    data: requestData
  });
}

export function getDomains(data) {
  return simpleRequest({
    type: "GET",
    dataType: "json",
    url: getProjectsApiUrl() + "/domains",
    data: data
  });
}

export function setDomains(data) {
  return simpleRequest({
    type: "POST",
    dataType: "json",
    url: getProjectsApiUrl() + "/domains",
    data: data
  });
}

export function updateDomains(id, data) {
  return simpleRequest({
    type: "PUT",
    dataType: "json",
    url: getProjectsApiUrl() + "/domains/" + id,
    data: data
  });
}

export function deleteDomains(id, data) {
  return simpleRequest({
    type: "DELETE",
    dataType: "json",
    url: getProjectsApiUrl() + "/domains/" + id,
    data: data
  });
}

export function connectDomain(id, data) {
  return simpleRequest({
    type: "PUT",
    dataType: "json",
    url: getProjectsApiUrl() + "/domains/" + id + "/connect",
    data: data
  });
}
