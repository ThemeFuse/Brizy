import {
  addAlerts,
  clearAlerts,
  handleRedirect,
  loginDisplay
} from "./utils.export";

export default function($node: JQuery): void {
  const node: Element = $node.get(0);

  const handleSubmit = (form: HTMLFormElement): Promise<Response> => {
    const { action } = form;

    const formData =
      // @ts-expect-error need to serialize form data
      new URLSearchParams(new FormData(form)).toString() + "&isEditorLogin";

    return fetch(action, {
      method: "POST",
      body: formData,
      headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    });
  };

  node.querySelectorAll(".brz-login").forEach(node => {
    loginDisplay(node);

    node
      .querySelectorAll<HTMLFormElement>(".brz-form-login-login")
      .forEach(form => {
        form.addEventListener("submit", e => {
          e.preventDefault();

          const emptyFieldsError = node.getAttribute("data-error-empty");
          const inputs = form.querySelectorAll<HTMLInputElement>(".brz-input");

          const valid = Array.from(inputs).every(input => input.value != "");

          clearAlerts(form);

          if (valid) {
            // block submit button for repeat click
            const submit = form.querySelector(".brz-btn");
            submit?.classList.add("brz-blocked");

            handleSubmit(form)
              .then(response => {
                submit?.classList.remove("brz-blocked");

                if (response.ok) {
                  return response.json();
                } else {
                  addAlerts(form);
                }
              })
              .then(data => {
                if (data.errors) {
                  addAlerts(form, data.errors);
                }
                if (data.success) {
                  handleRedirect(node);
                }
              });
          } else {
            clearAlerts(form);
            addAlerts(form, [
              emptyFieldsError || "All fields should be filled!"
            ]);
          }
        });
      });
  });
}
