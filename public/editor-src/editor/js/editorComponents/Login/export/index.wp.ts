import { getData, validateInputs } from "./utils";
import {
  addAlerts,
  getErrorMessages,
  handleSubmit,
  loginDisplay
} from "./utils.common";
import { getCurrentType } from "./utils.wp";

const wpHeaders = {
  accept: "*/*",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
};
const fetchHeaders = new Headers(wpHeaders);

let isSubmitEnabled = true;

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  node.querySelectorAll(".brz-login").forEach((element) => {
    loginDisplay(element);

    const errorMessages = getErrorMessages(element);

    // for WP we made AJAX only for Login
    element
      .querySelectorAll<HTMLFormElement>(
        ".brz-login-form__login, .brz-login-form__forgot, .brz-login-form__register"
      )
      .forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const elementType = getCurrentType(form);

          if (isSubmitEnabled && elementType) {
            const valid = validateInputs(elementType, form, errorMessages);

            const { action: fetchUrl } = form;

            if (valid.success) {
              const formData = getData(elementType, form);

              isSubmitEnabled = false;
              const submit = form.querySelector(".brz-btn");
              submit?.classList.add("brz-blocked");

              handleSubmit(
                elementType,
                fetchUrl,
                formData,
                fetchHeaders,
                form,
                element
              );

              isSubmitEnabled = true;
              submit?.classList.remove("brz-blocked");
            } else {
              addAlerts(form, valid.messages, "error");
            }
          }
        });
      });
  });
}
