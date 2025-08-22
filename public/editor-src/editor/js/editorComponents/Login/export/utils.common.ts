import { makeAttr } from "visual/utils/i18n/attribute";
import { Role } from "visual/utils/membership";
import { decodeFromString } from "visual/utils/string";

export enum ElementType {
  login = "login",
  register = "register",
  forgot = "forgot",
  authorized = "authorized"
}

export const getElementType = (type: unknown): ElementType | undefined =>
  Object.values(ElementType).includes(type as ElementType)
    ? (type as ElementType)
    : undefined;

export const displayChange = (node: Element, display: string): void => {
  node.setAttribute("style", `display: ${display};`);
};

export const findElems = (
  node: Element,
  selector: string
): NodeListOf<Element> => {
  return node.querySelectorAll(selector);
};

export const findElem = (
  node: Element,
  selector: string
): Element | undefined => {
  return findElems(node, selector)[0];
};

export const addAlerts = (
  form: Element,
  messages: string[],
  type: "success" | "error"
): void => {
  (messages || ["An error has occured."]).forEach((message) => {
    const alert = document.createElement("div");
    alert.className = `brz-login__alert brz-login__alert--${type}`;
    alert.innerHTML = message;

    form.parentNode?.appendChild(alert);
  });
};

export const clearAlerts = (form: Element): void => {
  form.parentNode?.querySelectorAll(".brz-login__alert").forEach((item) => {
    item.remove();
  });
};

export const parseCustomerGroups = (defaultRoles: string): Role[] => {
  try {
    return decodeFromString(defaultRoles);
  } catch {
    return [];
  }
};

export const validatePasswordsMatch = (
  passFields: HTMLInputElement[]
): boolean => {
  passFields.forEach((item) => {
    item.classList.remove("brz-login__field-empty");
  });

  if (passFields[0].value === passFields[1].value) {
    return true;
  } else {
    passFields.forEach((item) => {
      item.classList.add("brz-login__field-empty");
    });

    return false;
  }
};

export const validatePasswordsMin = (passField: HTMLInputElement): boolean => {
  passField.classList.remove("brz-login__field-empty");

  if (passField.value.length >= 6) {
    return true;
  } else {
    passField.classList.add("brz-login__field-empty");

    return false;
  }
};

export const getValidateInputs = (
  inputs: NodeListOf<HTMLInputElement>,
  errorMessages: Record<string, string>
): { success: boolean; messages: string[] } => {
  const { emptyFieldsError } = errorMessages;

  inputs.forEach((input) => {
    input.classList.remove("brz-login__field-empty");

    if (input.required && input.value === "") {
      input.classList.add("brz-login__field-empty");
    }
  });

  const inputEmpty = [...inputs].some(
    (input) => input.required && input.value === ""
  );

  if (inputEmpty) {
    return { success: false, messages: [emptyFieldsError] };
  }

  return { success: true, messages: [] };
};

export const getValidateRegisterInputs = (
  inputs: NodeListOf<HTMLInputElement>,
  errorMessages: Record<string, string>
): { success: boolean; messages: string[] } => {
  const { passLengthError, passMatchError } = errorMessages;

  const getValidation = getValidateInputs(inputs, errorMessages);

  if (!getValidation.success) {
    return { success: false, messages: getValidation.messages };
  }

  const passFields = [...inputs].filter(
    (input) => input.name === "password" || input.name === "passwordConfirm"
  );

  const isPasswordsMatch = validatePasswordsMatch(passFields);

  if (!isPasswordsMatch) {
    return { success: false, messages: [passMatchError] };
  }

  const isPasswordsMin = validatePasswordsMin(passFields[0]);

  if (!isPasswordsMin) {
    return { success: false, messages: [passLengthError] };
  }

  return { success: true, messages: [] };
};

export const handleRedirect = (node: Element): void => {
  const dataRedirect = node.getAttribute(makeAttr("redirect"));
  const dataRedirectValue = node.getAttribute(makeAttr("redirect-value"));

  if (dataRedirect === "samePage") {
    window.location.reload();
  } else {
    window.location.href = dataRedirectValue || "/";
  }
};

export const handleRedirectLogout = (node: Element): void => {
  const dataRedirect =
    node.getAttribute(makeAttr("logout-redirect")) ?? "samePage";
  const dataRedirectValue = node.getAttribute(
    makeAttr("logout-redirect-value")
  );

  if (dataRedirect === "samePage") {
    window.location.reload();
  } else {
    window.location.href = dataRedirectValue || "/";
  }
};

export const formTypeUpdate = (element: Element, formClass: string): void => {
  switch (formClass) {
    case ".brz-login-form__login":
      element.setAttribute("type", ElementType.login);
      break;
    case ".brz-login-form__register":
      element.setAttribute("type", ElementType.register);
      break;
    case ".brz-login-form__forgot":
      element.setAttribute("type", ElementType.forgot);
      break;
  }
};

export const clearForm = (form: Element): void => {
  form.querySelectorAll("input").forEach((item) => {
    item.value = "";
  });
};

export const handleSubmitSuccess = (
  form: Element,
  elementType: ElementType,
  node: Element
): void => {
  switch (elementType) {
    case ElementType.login:
    case ElementType.register:
      handleRedirect(node);
      break;
    case ElementType.authorized:
      handleRedirectLogout(node);
      break;
    case ElementType.forgot:
      clearForm(form);
      addAlerts(form, ["Email sent successfully"], "success");
      break;
  }
};

export const handleSubmitResponse =
  (
    elementType: ElementType,
    form: Element,
    node: Element
  ): ((response: Response) => void) =>
  (response: Response): void => {
    if (response.ok) {
      response
        .json()
        .then((data) => {
          if (data.success) {
            // maybe divide in Cloud and WP
            handleSubmitSuccess(form, elementType, node);
          } else {
            addAlerts(form, data.errors || [`An error has occured.`], "error");
          }
        })
        .catch((err: string) => {
          addAlerts(form, [err], "error");
        });
    } else if (response.status === 403) {
      response
        .json()
        .then((data) => {
          addAlerts(
            form,
            data.errors || [`An error has occured. ${response.status}`],
            "error"
          );
        })
        .catch((err: string) => {
          addAlerts(form, [err], "error");
        });
    } else {
      addAlerts(form, [`An error has occured. ${response.status}`], "error");
    }
  };

export const handleSubmit = (
  elementType: ElementType,
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
    .then(handleSubmitResponse(elementType, form, element))
    .catch((err) => {
      addAlerts(form, [err], "error");
    });
};

export const buttonEvent = (
  element: Element,
  buttons: NodeListOf<Element>,
  needToOpenFormClass: string
): void => {
  const needToOpenForm = findElem(element, needToOpenFormClass);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      clearAlerts(element);

      const needToCloseForm = button.closest(".brz-login-form");

      if (needToCloseForm && needToOpenForm) {
        displayChange(needToCloseForm, "none");
        displayChange(needToOpenForm, "flex");
        formTypeUpdate(element, needToOpenFormClass);
      }
    });
  });
};

export const loginDisplay = (element: Element): void => {
  const type = element.getAttribute("type");
  const isLogged = element.getAttribute(makeAttr("islogged")) === "true";

  const authorizedNode = findElem(element, ".brz-login__authorized");
  const loginNode = findElem(element, ".brz-login-form__login");
  const registerNode = findElem(element, ".brz-login-form__register");
  const forgotNode = findElem(element, ".brz-login-form__forgot");
  const redirectNode = findElem(element, "input[name=redirect_to]");

  if (redirectNode) {
    const redirectType = redirectNode.getAttribute(makeAttr("redirect"));

    if (redirectType === "samePage") {
      redirectNode.setAttribute("value", window.location.href);
    }
  }

  // For Login form
  if (isLogged) {
    authorizedNode && displayChange(authorizedNode, "block");
  } else {
    // For Login form
    if (type === ElementType.login && loginNode) {
      displayChange(loginNode, "flex");
    }
    // For Register form
    if (type === ElementType.register && registerNode) {
      displayChange(registerNode, "flex");
    }
    // For Forgot form
    if (type === ElementType.forgot && forgotNode) {
      displayChange(forgotNode, "flex");
    }
  }

  // Buttons
  const loginButton = findElems(element, ".brz-login-form__field-login-link");
  const lostPasswordButton = findElems(
    element,
    ".brz-login-form__field-lost-password"
  );
  const registerButton = findElems(
    element,
    ".brz-login-form__field-register-link"
  );

  // Login Form
  if (loginButton) {
    buttonEvent(element, loginButton, ".brz-login-form__login");
  }

  // Lost Password button
  if (lostPasswordButton) {
    buttonEvent(element, lostPasswordButton, ".brz-login-form__forgot");
  }

  // Lost Password button
  if (registerButton) {
    buttonEvent(element, registerButton, ".brz-login-form__register");
  }
};

export const getErrorMessages = (
  element: Element
): {
  emptyFieldsError: string;
  passLengthError: string;
  passMatchError: string;
} => {
  const emptyFieldsError =
    element.getAttribute(makeAttr("error-empty", true)) ||
    "Please fill in the mandatory fields";

  const passLengthError =
    element.getAttribute(makeAttr("error-passlength", true)) ||
    "Password should be at least 6 characters";

  const passMatchError =
    element.getAttribute(makeAttr("error-passmatch", true)) ||
    "Passwords do not match";

  return {
    emptyFieldsError,
    passLengthError,
    passMatchError
  };
};
