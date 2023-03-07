import React from "react";
import Login from "./index.jsx";

export default class WPLogin extends Login {
  getActions(type) {
    switch (type) {
      case "register":
        return "{{brizy_dc_ajax_url}}?action=editor_signup&hash={{editor_nonce action='brizy-login'}}";
      case "forgot":
        return "{{brizy_dc_ajax_url}}?action=editor_lostpassword&hash={{editor_nonce action='brizy-login'}}";
      default:
        return "{{brizy_dc_ajax_url}}?action=editor_login&hash={{editor_nonce action='brizy-login'}}";
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
