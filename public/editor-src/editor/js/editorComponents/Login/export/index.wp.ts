import { getData, validateInputs } from "./utils";
import {
  ElementType,
  loginDisplay,
  handleSubmit,
  getErrorMessages,
  addAlerts
} from "./utils.common";

const wpHeaders = {
  accept: "*/*",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
};
const fetchHeaders = new Headers(wpHeaders);

let isSubmitEnabled = true;

export default function($node: JQuery): void {
  const node: Element = $node.get(0);

  node.querySelectorAll(".brz-login").forEach(element => {
    loginDisplay(element);

    const errorMessages = getErrorMessages(element);

    // for WP we made AJAX only for Login
    element
      .querySelectorAll<HTMLFormElement>(".brz-login-form__login")
      .forEach(form => {
        form.addEventListener("submit", e => {
          e.preventDefault();

          if (isSubmitEnabled) {
            const valid = validateInputs(
              ElementType.login,
              form,
              errorMessages
            );

            const { action: fetchUrl } = form;

            if (valid.success) {
              const formData = getData(ElementType.login, form);

              isSubmitEnabled = false;
              const submit = form.querySelector(".brz-btn");
              submit?.classList.add("brz-blocked");

              handleSubmit(
                ElementType.login,
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
