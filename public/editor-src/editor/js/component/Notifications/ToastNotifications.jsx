import React from "react";
import Notification from "cogo-toast";
import EditorIcon from "visual/component/EditorIcon";

const ToastNotification = {
  error: (message, props = {}) => {
    Notification.error(message, {
      renderIcon() {
        return <EditorIcon icon="nc-info" />;
      },
      bar: {
        size: "2px",
        style: "solid",
        color: "currentColor"
      },
      ...props
    });
  },
  success: (message, props = {}) => {
    Notification.success(message, {
      renderIcon() {
        return <EditorIcon icon="nc-info" />;
      },
      bar: {
        size: "2px",
        style: "solid",
        color: "currentColor"
      },
      ...props
    });
  },
  info: (message, props = {}) => {
    Notification.info(message, {
      renderIcon() {
        return <EditorIcon icon="nc-info" />;
      },
      bar: {
        size: "2px",
        style: "solid",
        color: "currentColor"
      },
      ...props
    });
  },
  warn: (message, props = {}) => {
    Notification.warn(message, {
      renderIcon() {
        return <EditorIcon icon="nc-info" />;
      },
      bar: {
        size: "2px",
        style: "solid",
        color: "currentColor"
      },
      ...props
    });
  }
};

export { ToastNotification };
