import {
  addAlerts,
  clearAlerts,
  handleRedirect
} from "../Login/export/utils.common";

export enum CloudURL {
  reset = "/customer/password_update"
}

export const handleSubmitSuccess = (form: Element, node: Element): void => {
  addAlerts(form, ["Password reset successfully"], "success");
  handleRedirect(node);
};

export const handleSubmitResponse = (
  form: Element,
  node: Element
): ((response: Response) => void) => (response: Response): void => {
  if (response.ok) {
    response
      .json()
      .then(data => {
        if (data.success) {
          handleSubmitSuccess(form, node);
        } else {
          addAlerts(form, data.errors || [], "error");
        }
      })
      .catch((err: string) => {
        addAlerts(form, [err], "error");
      });
  } else {
    addAlerts(form, [`An error has occured. ${response.status}`], "error");
  }
};

export const handleSubmit = (
  url: string,
  formData: string,
  fetchHeaders: Headers,
  form: Element,
  element: Element
): Promise<void> => {
  return fetch(url, {
    method: "POST",
    mode: "same-origin",
    body: formData,
    headers: fetchHeaders
  })
    .then(handleSubmitResponse(form, element))
    .catch(err => {
      addAlerts(form, [err], "error");
    });
};

const getRequiredInputsSelector = (): string => {
  return "input[name='password'], input[name='passwordConfirm']";
};

export const getInputs = (form: Element): NodeListOf<HTMLInputElement> => {
  const inputsSelector = getRequiredInputsSelector();

  return form.querySelectorAll<HTMLInputElement>(inputsSelector);
};

export const getData = (form: Element): string => {
  const inputs = getInputs(form);

  const data: Record<string, unknown> = {};

  inputs.forEach(item => {
    const { name, value } = item;

    data[name] = value;
  });

  data.resetPasswordToken =
    new URLSearchParams(location.search).get("token") || "";

  return JSON.stringify(data);
};

export const validateInputs = (
  form: Element,
  errorMessages: Record<string, string>
): { success: boolean; messages: string[] } => {
  clearAlerts(form);

  const inputs = getInputs(form);
  const { passLengthError, passMatchError, emptyFieldsError } = errorMessages;

  inputs.forEach(input => {
    input.classList.remove("brz-reset-psw__field-empty");

    if (input.required && input.value === "") {
      input.classList.add("brz-reset-psw__field-empty");
    }
  });

  const inputEmpty = [...inputs].some(
    input => input.required && input.value === ""
  );

  if (inputEmpty) {
    return { success: false, messages: [emptyFieldsError] };
  }

  if (inputs[0].value.length < 6) {
    inputs[0].classList.add("brz-reset-psw__field-empty");

    return { success: false, messages: [passLengthError] };
  }

  if (inputs[0].value !== inputs[1].value) {
    inputs.forEach(item => {
      item.classList.add("brz-reset-psw__field-empty");
    });

    return { success: false, messages: [passMatchError] };
  }

  return { success: true, messages: [] };
};
