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

export const addAlerts = (form: Element, messages?: string[]): void => {
  (messages || ["An error has occured."]).forEach(message => {
    const alert = document.createElement("div");
    alert.className = "brz-login__alert";
    alert.innerHTML = message;

    form.parentNode?.appendChild(alert);
  });
};

export const clearAlerts = (form: HTMLFormElement): void => {
  form.parentNode?.querySelectorAll(".brz-login__alert").forEach(item => {
    item.remove();
  });
};

export const handleRedirect = (node: Element): void => {
  const dataRedirect = node.getAttribute("data-redirect");
  const dataRedirectValue = node.getAttribute("data-redirect-value");

  if (dataRedirect === "samePage") {
    window.location.reload();
  } else {
    window.location.href = dataRedirectValue || "/";
  }
};

export const formTypeUpdate = (node: Element, formClass: string): void => {
  switch (formClass) {
    case ".brz-form-login-login":
      node.setAttribute("type", "login");
      break;
    case ".brz-form-login-register":
      node.setAttribute("type", "register");
      break;
    case ".brz-form-login-forgot":
      node.setAttribute("type", "forgot");
      break;
  }
};

export const buttonEvent = (
  node: Element,
  buttons: NodeListOf<Element>,
  needToOpenFormClass: string
): void => {
  const needToOpenForm = findElem(node, needToOpenFormClass);

  buttons.forEach(element => {
    element.addEventListener("click", () => {
      const needToCloseForm = element.closest(".brz-form-login");

      if (needToCloseForm && needToOpenForm) {
        displayChange(needToCloseForm, "none");
        displayChange(needToOpenForm, "flex");
        formTypeUpdate(node, needToOpenFormClass);
      }
    });
  });
};
export const loginDisplay = (node: Element): void => {
  const type = node.getAttribute("type");
  const isLogged = node.getAttribute("data-islogged") === "true";

  const authorizedNode = findElem(node, ".brz-login__autorized");
  const loginNode = findElem(node, ".brz-form-login-login");
  const registerNode = findElem(node, ".brz-form-login-register");
  const forgotNode = findElem(node, ".brz-form-login-forgot");
  const redirectNode = findElem(node, "input[name=redirect_to]");

  if (redirectNode) {
    const redirectType = redirectNode.getAttribute("data-redirect");

    if (redirectType === "samePage") {
      redirectNode.setAttribute("value", window.location.href);
    }
  }

  // For Login form
  if (isLogged) {
    authorizedNode && displayChange(authorizedNode, "block");
  } else {
    // For Login form
    if (type === "login" && loginNode) {
      displayChange(loginNode, "flex");
    }
    // For Register form
    if (type === "register" && registerNode) {
      displayChange(registerNode, "flex");
    }
    // For Forgot form
    if (type === "forgot" && forgotNode) {
      displayChange(forgotNode, "flex");
    }
  }

  // Buttons
  const loginButton = findElems(node, ".brz-form-login__field-login-link");
  const lostPasswordButton = findElems(
    node,
    ".brz-form-login__field-lost-password"
  );
  const registerButton = findElems(
    node,
    ".brz-form-login__field-register-link"
  );

  // Login Form
  if (loginButton) {
    buttonEvent(node, loginButton, ".brz-form-login-login");
  }

  // Lost Password button
  if (lostPasswordButton) {
    buttonEvent(node, lostPasswordButton, ".brz-form-login-forgot");
  }

  // Lost Password button
  if (registerButton) {
    buttonEvent(node, registerButton, ".brz-form-login-register");
  }
};
