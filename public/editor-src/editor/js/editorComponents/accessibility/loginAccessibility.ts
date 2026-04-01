type Variant = "login" | "register" | "forgot" | "authorized";

const isVisible = (el: Element): el is HTMLElement =>
  el instanceof HTMLElement && window.getComputedStyle(el).display !== "none";

const setButtonLike = (el: HTMLElement): void => {
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      el.click();
    }
  });
};

const ensureInputLabels = (root: HTMLElement): void => {
  root.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
    if (input.type === "hidden") return;
    if (input.getAttribute("aria-label")) return;

    const labelledBy = input.getAttribute("aria-labelledby");
    if (labelledBy) return;

    const id = input.id;
    if (id) {
      const label = root.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (label) return;
    }

    const fallback =
      input.getAttribute("placeholder") || input.getAttribute("name") || "Field";
    input.setAttribute("aria-label", fallback);
  });
};

export class LoginAccessibility {
  private root: HTMLElement;
  private instanceId: string;

  constructor(root: HTMLElement) {
    this.root = root;
    this.instanceId =
      root.getAttribute("data-brz-login-a11y-id") ||
      `brz-login-a11y-${Math.random().toString(36).slice(2, 9)}`;
    this.root.setAttribute("data-brz-login-a11y-id", this.instanceId);
  }

  public init(): void {
    this.root.setAttribute("role", "region");
    this.root.setAttribute("aria-label", "Account");

    const authorized = this.root.querySelector<HTMLElement>(
      ".brz-login__authorized"
    );
    const authorizedAction =
      authorized?.querySelector<HTMLElement>(".brz-login__authorized-link") ??
      authorized?.querySelector<HTMLElement>("span");
    if (authorizedAction instanceof HTMLElement) {
      setButtonLike(authorizedAction);
      authorizedAction.setAttribute("aria-label", "Logout");
    }

    const loginForm = this.root.querySelector<HTMLElement>(".brz-login-form__login");
    const registerForm = this.root.querySelector<HTMLElement>(
      ".brz-login-form__register"
    );
    const forgotForm = this.root.querySelector<HTMLElement>(".brz-login-form__forgot");

    if (loginForm) loginForm.id ||= `${this.instanceId}-form-login`;
    if (registerForm) registerForm.id ||= `${this.instanceId}-form-register`;
    if (forgotForm) forgotForm.id ||= `${this.instanceId}-form-forgot`;

    // Make variant switchers keyboard accessible + connect them with aria-controls.
    this.root
      .querySelectorAll<HTMLElement>(".brz-login-form__field-login-link")
      .forEach((el) => {
        setButtonLike(el);
        if (loginForm?.id) el.setAttribute("aria-controls", loginForm.id);
        el.setAttribute("aria-label", el.textContent?.trim() || "Back to login");
      });

    this.root
      .querySelectorAll<HTMLElement>(".brz-login-form__field-register-link")
      .forEach((el) => {
        setButtonLike(el);
        if (registerForm?.id) el.setAttribute("aria-controls", registerForm.id);
        el.setAttribute("aria-label", el.textContent?.trim() || "Register");
      });

    this.root
      .querySelectorAll<HTMLElement>(".brz-login-form__field-lost-password")
      .forEach((el) => {
        setButtonLike(el);
        if (forgotForm?.id) el.setAttribute("aria-controls", forgotForm.id);
        el.setAttribute("aria-label", el.textContent?.trim() || "Lost password");
      });

    // Keep aria-hidden in sync with display switching (click handlers live elsewhere).
    this.root.addEventListener(
      "click",
      () => {
        setTimeout(() => this.sync(), 0);
      },
      true
    );

    ensureInputLabels(this.root);
    this.sync();
  }

  public sync(): void {
    const authorized = this.root.querySelector(".brz-login__authorized");
    const loginForm = this.root.querySelector(".brz-login-form__login");
    const registerForm = this.root.querySelector(".brz-login-form__register");
    const forgotForm = this.root.querySelector(".brz-login-form__forgot");

    const current = this.getCurrentVariant({
      authorized,
      loginForm,
      registerForm,
      forgotForm
    });

    this.root.setAttribute("data-brz-login-variant", current);

    if (authorized instanceof HTMLElement) {
      authorized.setAttribute("aria-hidden", (!isVisible(authorized)).toString());
    }
    if (loginForm instanceof HTMLElement) {
      loginForm.setAttribute("aria-hidden", (!isVisible(loginForm)).toString());
      loginForm.setAttribute("aria-label", "Login");
    }
    if (registerForm instanceof HTMLElement) {
      registerForm.setAttribute("aria-hidden", (!isVisible(registerForm)).toString());
      registerForm.setAttribute("aria-label", "Register");
    }
    if (forgotForm instanceof HTMLElement) {
      forgotForm.setAttribute("aria-hidden", (!isVisible(forgotForm)).toString());
      forgotForm.setAttribute("aria-label", "Lost password");
    }
  }

  private getCurrentVariant(nodes: {
    authorized: Element | null;
    loginForm: Element | null;
    registerForm: Element | null;
    forgotForm: Element | null;
  }): Variant {
    if (nodes.authorized && isVisible(nodes.authorized)) return "authorized";
    if (nodes.loginForm && isVisible(nodes.loginForm)) return "login";
    if (nodes.registerForm && isVisible(nodes.registerForm)) return "register";
    if (nodes.forgotForm && isVisible(nodes.forgotForm)) return "forgot";

    // Fallback to the element attribute used by existing logic.
    const type = this.root.getAttribute("type");
    if (type === "register" || type === "forgot" || type === "authorized") {
      return type;
    }
    return "login";
  }
}

