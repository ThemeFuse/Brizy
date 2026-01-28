import { ElementType, clearAlerts, getValidateInputs } from "./utils.common";

const getRequiredInputsSelector = (elementType: ElementType): string => {
  switch (elementType) {
    case ElementType.login:
      return "input[name='log'], input[name='pwd'], input[name='agreeterms']";
    case ElementType.register:
      return "input[name='user_login'], input[name='user_email'], input[name='agreeterms']";
    case ElementType.forgot:
      return "input[name='user_login']";
    case ElementType.authorized:
      return "";
  }
};

export const getInputs = (
  elementType: ElementType,
  form: HTMLFormElement
): NodeListOf<HTMLInputElement> => {
  const inputsSelector = getRequiredInputsSelector(elementType);

  return form.querySelectorAll<HTMLInputElement>(inputsSelector);
};

export const validateInputs = (
  elementType: ElementType,
  form: HTMLFormElement,
  errorMessages: Record<string, string>
): { success: boolean; messages: string[] } => {
  clearAlerts(form);

  const inputs = getInputs(elementType, form);

  switch (elementType) {
    case ElementType.login:
      return getValidateInputs(inputs, errorMessages);

    case ElementType.register:
    case ElementType.forgot:
    case ElementType.authorized:
      return { success: true, messages: [] };
  }
};

export const getData = (
  elementType: ElementType,
  form: HTMLFormElement
): string => {
  const inputs = getInputs(elementType, form);
  const formData = new FormData(form);

  inputs.forEach((item) => {
    const { name, value, type } = item;

    if (type === "checkbox") {
      if (name === "rememberme" && item.checked) {
        formData.set("rememberme", "true");
      } else if (name === "agreeterms") {
        formData.set("agreeterms", item.checked ? "true" : "false");
      }
    } else {
      formData.set(name, value);
    }
  });

  return (
    // @ts-expect-error need to serialize form data
    new URLSearchParams(formData).toString()
  );
};

export const getCurrentType = (form: HTMLFormElement) => {
  if (form.classList.contains("brz-login-form__login")) {
    return ElementType.login;
  }

  if (form.classList.contains("brz-login-form__forgot")) {
    return ElementType.forgot;
  }

  if (form.classList.contains("brz-login-form__register")) {
    return ElementType.register;
  }
};
