export default function($node: JQuery): void {
  const node: Element = $node.get(0);

  const displayChange = (node: Element, display: string): void => {
    node.setAttribute("style", `display: ${display};`);
  };
  const findElem = (node: Element, selector: string): Element | undefined => {
    return node.querySelectorAll(selector)[0];
  };

  const buttonEvent = (button: Element, needToOpenFormClass: string): void => {
    const needToCloseForm = button.closest(".brz-form-login");
    const needToOpenForm = findElem(node, needToOpenFormClass);

    if (needToOpenForm && needToCloseForm) {
      button.addEventListener("click", () => {
        displayChange(needToCloseForm, "none");
        displayChange(needToOpenForm, "flex");
      });
    }
  };

  const logins: NodeListOf<Element> = node.querySelectorAll(".brz-login");

  logins.forEach((node): void => {
    const type: string | null = node.getAttribute("type");
    const isLogged: boolean = node.getAttribute("data-islogged") === "true";
    const isAuthorized: boolean =
      isLogged && (type === "login" || type === "authorized");

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
    if (isAuthorized) {
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
    const loginButton = findElem(node, ".brz-form-login__field-login-link");
    const lostPasswordButton = findElem(
      node,
      ".brz-form-login__field-lost-password"
    );
    const registerButton = findElem(
      node,
      ".brz-form-login__field-register-link"
    );

    // Login Form
    if (loginButton) {
      buttonEvent(loginButton, ".brz-form-login-login");
    }

    // Lost Password button
    if (lostPasswordButton) {
      buttonEvent(lostPasswordButton, ".brz-form-login-forgot");
    }

    // Lost Password button
    if (registerButton) {
      buttonEvent(registerButton, ".brz-form-login-register");
    }
  });
}
