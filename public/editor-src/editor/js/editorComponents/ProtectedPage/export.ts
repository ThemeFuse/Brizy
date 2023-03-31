import { decodeFromString } from "visual/utils/string";

export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  type Messages = {
    empty: string;
    fail: string;
    invalid: string;
  };

  const clearAlerts = (form: HTMLFormElement): void => {
    form.parentNode?.querySelector(".brz-protected__alert")?.remove();
  };

  const addAlert = (form: HTMLFormElement, message: string): void => {
    const alert = document.createElement("div");

    alert.className = "brz-protected__alert";
    alert.innerHTML = message;

    form.parentNode?.appendChild(alert);
  };

  const getErrorMessages = (form: HTMLFormElement): Messages => {
    const { messages } = form.dataset;

    const _messages: Messages | null = messages
      ? decodeFromString(messages)
      : null;

    return {
      empty: _messages?.empty || "The field should not be empty!",
      fail: _messages?.fail || "An error has occured!",
      invalid: _messages?.invalid || "Please insert a valid code!"
    };
  };

  const handleSubmit = (
    form: HTMLFormElement,
    inputValue: string
  ): Promise<void> => {
    clearAlerts(form);

    // block submit button for repeat click
    const submit = form.querySelector(".brz-btn");
    submit?.classList.add("brz-blocked");

    const data = {
      protected_page_token: inputValue
    };

    const action = form.dataset.action || "/";

    const { fail, invalid } = getErrorMessages(form);

    return fetch(action, {
      method: "POST",
      mode: "same-origin",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((data) => {
      submit?.classList.remove("brz-blocked");
      clearAlerts(form);

      if (data.ok) {
        window.location.reload();
      } else {
        if (data.status === 404) {
          addAlert(form, fail);
        } else {
          addAlert(form, invalid);
        }
      }
    });
  };

  node
    .querySelectorAll<HTMLFormElement>(".brz-protected-form")
    .forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const { empty } = getErrorMessages(form);

        const input = form.querySelector<HTMLInputElement>(".brz-input");

        const inputValue = input?.value;

        if (inputValue) {
          handleSubmit(form, inputValue);
        } else {
          clearAlerts(form);
          addAlert(form, empty);
        }
      });
    });
}
