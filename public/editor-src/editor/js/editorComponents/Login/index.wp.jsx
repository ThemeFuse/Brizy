import React from "react";
import { makePlaceholder } from "visual/utils/dynamicContent";
import Login from "./index.jsx";

export default class WPLogin extends Login {
  getActions(type) {
    const ajaxUrl = makePlaceholder({
      content: "{{brizy_dc_ajax_url}}"
    });
    const hash = makePlaceholder({
      content: "{{editor_nonce}}",
      attr: { action: "brizy-login" }
    });

    switch (type) {
      case "register": {
        return `${ajaxUrl}?action=editor_signup&hash=${hash}`;
      }
      case "forgot":
        return `${ajaxUrl}?action=editor_lostpassword&hash=${hash}`;
      default:
        return `${ajaxUrl}?action=editor_login&hash=${hash}`;
    }
  }

  renderFormForView(v) {
    return (
      <>
        {this.renderAuthorizedForm(v)}

        <form
          className="brz-login-form brz-login-form__login"
          noValidate
          action={this.getActions("login")}
        >
          {this.renderLoginForm(v)}
        </form>

        {this.canRegister() && (
          <form
            className="brz-login-form brz-login-form__register"
            noValidate
            action={this.getActions("register")}
            method="post"
          >
            {this.renderRegisterForm(v)}
          </form>
        )}

        <form
          className="brz-login-form brz-login-form__forgot"
          noValidate
          action={this.getActions("forgot")}
          method="post"
        >
          {this.renderForgotForm(v)}
        </form>
      </>
    );
  }
}
