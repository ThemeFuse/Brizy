import { makeAttr } from "visual/utils/i18n/attribute";
import {
  ElementType,
  clearAlerts,
  getValidateInputs,
  getValidateRegisterInputs,
  parseCustomerGroups
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
      return "input[name='email'], input[name='password'], input[name='passwordConfirm'], input[name='rememberme'], input[name='agreeterms']";
    case ElementType.register:
      return "input[name='firstName'], input[name='lastName'], input[name='userName'], input[name='email'], input[name='password'], input[name='passwordConfirm'], input[name='phone'], input[name='agreeterms']";
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
      inputs.forEach(({ name, value }) => {
        data[name] = value;
      });

      const defaultRoles = form.getAttribute(makeAttr("defaultrole")) || "";
      const customerGroups = parseCustomerGroups(defaultRoles);

      if (customerGroups.length) {
        data.customerGroups = customerGroups;
      }

      break;
    }
    case ElementType.forgot: {
      inputs.forEach((item) => {
        const { name, value } = item;

        data[name] = value;
      });

      break;
    }
    case ElementType.login: {
      inputs.forEach((item) => {
        const { type, name } = item;

        if (["text", "password"].includes(type)) {
          const { value } = item;

          data[name] = value;
        } else if ("checkbox" === type) {
          if (name === "rememberme") {
            data.rememberMe = item.checked ? "on" : "off";
          } else if (name === "agreeterms") {
            data.agreeTerms = item.checked ? "true" : "false";
          }
        }
      });
      break;
    }
  }

  return JSON.stringify(data);
};
