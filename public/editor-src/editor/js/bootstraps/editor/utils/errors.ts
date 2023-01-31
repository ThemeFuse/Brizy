import { ToastNotification } from "visual/component/Notifications";
import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";

export const showError = (data: {
  e: unknown;
  container?: HTMLElement;
  hideAfter?: number;
}): void => {
  const { e, container, hideAfter } = data;
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

  ToastNotification.error(message, {
    hideAfter,
    toastContainer: container
  });
};
