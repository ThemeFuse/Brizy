import { addAlerts, getErrorMessages } from "../Login/export/utils.common";
import {
  CloudURL,
  getData,
  handleSubmit,
  validateInputs
} from "./utils.export";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  const cloudHeaders = { "Content-Type": "application/json" };
  const fetchHeaders = new Headers(cloudHeaders);

  let isSubmitEnabled = true;

  node.querySelectorAll(".brz-reset-psw").forEach((element) => {
    const errorMessages = getErrorMessages(element);

    const form = element.querySelector<HTMLFormElement>(".brz-reset-psw-form");

    form &&
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (isSubmitEnabled) {
          const valid = validateInputs(form, errorMessages);

          const fetchUrl = CloudURL.reset;

          if (valid.success) {
            const formData = getData(form);

            isSubmitEnabled = false;
            const submit = form.querySelector(".brz-btn");
            submit?.classList.add("brz-blocked");

            handleSubmit(fetchUrl, formData, fetchHeaders, form, element);

            isSubmitEnabled = true;
            submit?.classList.remove("brz-blocked");
          } else {
            addAlerts(form, valid.messages, "error");
          }
        }
      });
  });
}
