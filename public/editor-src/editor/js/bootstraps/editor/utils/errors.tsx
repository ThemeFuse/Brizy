import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import { ToastNotification } from "visual/component/Notifications";
import Portal from "visual/component/Portal";
import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";

interface Data {
  e: unknown;
  hideAfter?: number;
  inRoot?: boolean;
}

export const showError = (data: Data): void => {
  const { e, hideAfter, inRoot } = data;
  const isCustomError = e instanceof CustomError;

  /* eslint-disable no-console */
  if (isCustomError) {
    console.error("editor bootstrap error", e.getMessage());
  } else {
    console.error("editor bootstrap error", e);
  }
  /* eslint-enabled no-console */

  const message =
    isCustomError && e.getMessage()
      ? e.getMessage()
      : t("Something went wrong");

  // Need to show error with ReactDom.render when inRoot is true
  // because the main app is not mounted yet,
  // so we can't use ToastNotification directly
  if (inRoot) {
    const appDiv = document.querySelector("#brz-ed-root") ?? document.body;
    ReactDOM.render(
      <Portal node={window.parent.document.body}>
        <ToastContainer />
      </Portal>,
      appDiv
    );
  }

  ToastNotification.error(message, hideAfter);
};
