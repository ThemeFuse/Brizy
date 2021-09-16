import React from "react";
import Notification from "cogo-toast";
import EditorIcon from "visual/component/EditorIcon";

const toastId = "ct-container";

const getToastContainer = container => {
  let rootContainer = null;

  if (container) {
    const toastContainer = container.querySelector(`#${toastId}`);

    if (toastContainer) {
      rootContainer = toastContainer;
    } else {
      rootContainer = document.createElement("div");
      rootContainer.id = toastId;
    }

    container.append(rootContainer);
  }

  return rootContainer;
};

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
      ...props,
      toastContainer: getToastContainer(props.toastContainer)
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
      ...props,
      toastContainer: getToastContainer(props.toastContainer)
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
      ...props,
      toastContainer: getToastContainer(props.toastContainer)
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
      ...props,
      toastContainer: getToastContainer(props.toastContainer)
    });
  }
};

export { ToastNotification };
