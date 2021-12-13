import React from "react";
import Login from "./index.jsx";

export default class WPLogin extends Login {
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
