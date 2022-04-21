import {
  clearAlerts,
  ElementType,
  parseCustomerGroups,
  getValidateInputs,
  getValidateRegisterInputs
} from "./utils.common";

export enum CloudURL {
  login = "/customer/login",
  registration = "/customer/registration",
  logout = "/customer/logout",
  forgot = "/customer/password_reset"
}

export const getFetchUrl = (elementType: ElementType): string => {
  switch (elementType) {
    case ElementType.login:
      return CloudURL.login;
    case ElementType.register:
      return CloudURL.registration;
    case ElementType.authorized:
      return CloudURL.logout;
    case ElementType.forgot:
      return CloudURL.forgot;
  }
};

const getRequiredInputsSelector = (elementType: ElementType): string => {
  switch (elementType) {
    case ElementType.login:
      return "input[name='email'], input[name='password'], input[name='passwordConfirm'], input[name='rememberme']";
    case ElementType.register:
      return "input[name='firstName'], input[name='lastName'], input[name='userName'], input[name='email'], input[name='password'], input[name='passwordConfirm'], input[name='phone']";
    case ElementType.forgot:
      return "input[name='email']";
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
    case ElementType.register:
      return getValidateRegisterInputs(inputs, errorMessages);

    case ElementType.login:
    case ElementType.forgot:
      return getValidateInputs(inputs, errorMessages);

    case ElementType.authorized:
      return { success: true, messages: [] };
  }
};

export const getData = (
  elementType: ElementType,
  form: HTMLFormElement
): string => {
  const inputs = getInputs(elementType, form);

  const data: Record<string, unknown> = {};

  switch (elementType) {
    case ElementType.register: {
      inputs.forEach(item => {
        const { name, value } = item;

        data[name] = value;
      });

      const defaultRoles = form.getAttribute("data-defaultrole") || "";
      data.customerGroups = parseCustomerGroups(defaultRoles);

      break;
    }
    case ElementType.forgot: {
      inputs.forEach(item => {
        const { name, value } = item;

        data[name] = value;
      });

      break;
    }
    case ElementType.login: {
      inputs.forEach(item => {
        const { type } = item;

        if (["text", "password"].includes(type)) {
          const { name, value } = item;

          data[name] = value;
        } else if ("checkbox" === type) {
          data.rememberMe = item.checked ? "on" : "off";
        }
      });
      break;
    }
  }

  return JSON.stringify(data);
};
