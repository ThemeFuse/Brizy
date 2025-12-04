import React from "react";
import { createRoot } from "react-dom/client";
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

  if (isCustomError) {
    console.error("editor bootstrap error", e.getMessage());
  } else {
    console.error("editor bootstrap error", e);
  }

  const message =
    isCustomError && e.getMessage()
      ? e.getMessage()
      : t("Something went wrong");

  // Need to show error with createRoot when inRoot is true
  // because the main app is not mounted yet,
  // so we can't use ToastNotification directly
  if (inRoot) {
    const appDiv = document.querySelector("#brz-ed-root") ?? document.body;
    const app = (
      <Portal node={window.parent.document.body}>
        <ToastContainer />
      </Portal>
    );
    const root = createRoot(appDiv);

    root.render(app);
  }

  ToastNotification.error(message, hideAfter);
};
