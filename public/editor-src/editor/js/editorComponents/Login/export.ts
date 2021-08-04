import {
  loginDisplay,
  addAlerts,
  clearAlerts,
  handleRedirect
} from "./utils.export";

export default function($node: JQuery): void {
  const node: Element = $node.get(0);

  const getFetchUrl = (node: Element): string | undefined => {
    const type: string | null = node.getAttribute("type");

    switch (type) {
      case "login":
        return "customer/login";
      case "register":
        return "customer/register";
      case "forgot":
      case null:
        return undefined;
    }
  };

  const handleSubmit = (
    url: string,
    form: HTMLFormElement
  ): Promise<Response> => {
    const data = new FormData(form);
    const formData = Object.fromEntries(data.entries());

    return fetch(url, {
      method: "POST",
      mode: "same-origin",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  node.querySelectorAll(".brz-login").forEach(node => {
    loginDisplay(node);

    node.querySelectorAll<HTMLFormElement>(".brz-form-login").forEach(form => {
      form.addEventListener("submit", e => {
        e.preventDefault();

        const emptyFieldsError = node.getAttribute("data-error-empty");
        const submitUrlError = node.getAttribute("data-error-url");
        const inputs = form.querySelectorAll<HTMLInputElement>(".brz-input");

        const valid = Array.from(inputs).every(
          input => input.value != "" || !input.required
        );

        const fetchUrl = getFetchUrl(node);

        if (valid && fetchUrl) {
          const submit = form.querySelector(".brz-btn");
          submit?.classList.add("brz-blocked");

          handleSubmit(fetchUrl, form).then(response => {
            submit?.classList.remove("brz-blocked");
            clearAlerts(form);

            if (response.ok) {
              handleRedirect(node);
            } else {
              addAlerts(form, [response.statusText]);
            }
          });
        } else if (!valid) {
          clearAlerts(form);
          addAlerts(form, [emptyFieldsError || "All fields should be filled!"]);
        } else {
          clearAlerts(form);
          addAlerts(form, [
            submitUrlError || "Something went wrong, try again later"
          ]);
        }
      });
    });
  });
}
