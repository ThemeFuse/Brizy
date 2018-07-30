import _ from "underscore";
import { addLast, removeAt } from "timm";
import UIState from "./UIState";

function findById(arr, id) {
  return _.find(arr, function(item) {
    return item.id === id;
  });
}

var KEY = "notifications";
var Notifications = {
  notificationTypes: {
    success: 0,
    error: 1
  },

  addChangeListener: function(callback) {
    UIState.addChangeListener(KEY, callback);
  },

  removeChangeListener: function(callback) {
    UIState.removeChangeListener(KEY, callback);
  },

  // TODO: implement cloning
  getNotifications: function() {
    return UIState.get(KEY) || [];
  },

  addNotification: function(data) {
    var notifications = this.getNotifications();
    var id = data.id || _.uniqueId();

    // do not add the same notification if it already exists
    if (findById(notifications, id)) {
      return id;
    }

    var newNotifications = addLast(notifications, {
      id: id,
      type: data.type || this.notificationTypes.success,
      text: data.text || "Notification without text",
      dismissible:
        data.dismissible !== undefined ? Boolean(data.dismissible) : true,
      autoDismissAfter: Number(data.autoDismissAfter) || 10000
    });
    UIState.set(KEY, newNotifications);

    return id;
  },

  removeNotification: function(id) {
    var notifications = this.getNotifications();
    var toBeDeleted = findById(notifications, id);

    if (!toBeDeleted) {
      return;
    }

    var index = notifications.indexOf(toBeDeleted);
    var newNotifications = removeAt(notifications, index);
    UIState.set(KEY, newNotifications);
  }
};

export default Notifications;
