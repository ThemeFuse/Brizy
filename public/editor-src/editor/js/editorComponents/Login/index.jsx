import React from "react";
import Config from "visual/global/Config";
import { noop } from "underscore";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import * as toolbarExtendLostPasswordConfig from "./toolbarExtendLostPassword";
import CustomCSS from "visual/component/CustomCSS";
import * as toolbarExtend from "./toolbarExtend";
import toolbarExtendParentFn from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as toolbarExtendCheckbox from "./toolbarExtendCheckbox";
import * as toolbarExtendButton from "visual/editorComponents/Login/toolbarExtendButton";
import * as sidebarExtendButton from "visual/editorComponents/Login/sidebarExtendButton";
import * as toolbarAutorized from "visual/editorComponents/Login/toolbarAutorized";
import * as toolbarRegisterInfo from "visual/editorComponents/Login/toolbarRegisterInfo";
import * as toolbarRegisterLink from "visual/editorComponents/Login/toolbarRegisterLink";
import * as toolbarLoginLink from "visual/editorComponents/Login/toolbarLoginLink";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../tools/Wrapper";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { IS_WP } from "visual/utils/env";

class Login extends EditorComponent {
  static get componentId() {
    return "Login";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  canRegister = () => {
    return IS_WP ? Config.get("wp").usersCanRegister === "1" : true;
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentFn(this.canRegister()),
      sidebarExtendParent,
      { allowExtend: false }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleResizerChange = patch => this.patchValue(patch);

  handleLinkChange = lostPassword => {
    this.patchValue({ lostPassword });
  };

  handleRegisterLinkChange = registerLink => {
    this.patchValue({ registerLink });
  };

  handleLoginLinkChange = loginLink => {
    this.patchValue({ loginLink });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  getRegisterSlices() {
    if (IS_WP) {
      return {
        startIndex: 3,
        endIndex: 6
      };
    }

    return {
      startIndex: 11,
      endIndex: 16
    };
  }

  getButtonSlices(itemLength, type) {
    if (itemLength < 9) {
      return { startIndex: 7, endIndex: 8 };
    } else {
      switch (type) {
        case "login":
          return {
            startIndex: 8,
            endIndex: 9
          };
        case "register":
          return {
            startIndex: 9,
            endIndex: 10
          };
        case "forgot":
          return {
            startIndex: 10,
            endIndex: 11
          };
      }
    }
  }

  renderLoginFields(v) {
    const fieldsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: 3,
      itemProps: {
        meta: this.props.meta,
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtendCheckbox: this.makeToolbarPropsFromConfig2(
          toolbarExtendCheckbox,
          null,
          { allowExtend: false }
        ),
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        showLabel: v.showLabel,
        showPlaceholder: v.showPlaceholder,
        remember: v.remember
      }
    });
    return <EditorArrayComponent {...fieldsProps} />;
  }

  renderRegisterFields(v) {
    const sliceIndexes = this.getRegisterSlices();
    const fieldsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: sliceIndexes.startIndex,
      sliceEndIndex: sliceIndexes.endIndex,
      itemProps: {
        meta: this.props.meta,
        toolbarRegisterInfo: this.makeToolbarPropsFromConfig2(
          toolbarRegisterInfo,
          null,
          {
            allowExtend: false
          }
        ),
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtendCheckbox: this.makeToolbarPropsFromConfig2(
          toolbarExtendCheckbox,
          null,
          { allowExtend: false }
        ),
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        showLabel: v.showLabel,
        showPlaceholder: v.showPlaceholder,
        remember: v.remember,
        showRegisterInfo: v.showRegisterInfo
      }
    });
    return <EditorArrayComponent {...fieldsProps} />;
  }

  renderForgotPasswordFields(v) {
    const fieldsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 6,
      sliceEndIndex: 7,
      itemProps: {
        meta: this.props.meta,
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtendCheckbox: this.makeToolbarPropsFromConfig2(
          toolbarExtendCheckbox,
          null,
          { allowExtend: false }
        ),
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        showLabel: v.showLabel,
        showPlaceholder: v.showPlaceholder,
        remember: v.remember
      }
    });
    return <EditorArrayComponent {...fieldsProps} />;
  }

  renderButton(itemLength, type) {
    const buttonSlices = this.getButtonSlices(itemLength, type);
    const buttonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: buttonSlices.startIndex,
      sliceEndIndex: buttonSlices.endIndex,
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendButton,
          sidebarExtendButton,
          { allowExtend: false }
        ),
        attributes: IS_EDITOR
          ? {}
          : {
              type: "submit",
              name: "wp-submit"
            }
      }
    });
    return (
      <div className="brz-form-login__field brz-login__item-button">
        <div className="brz-login__item brz-align-self-xs-end">
          <EditorArrayComponent {...buttonsProps} />
        </div>
      </div>
    );
  }

  renderLostYourPasswordLink(lostPassword) {
    if (!IS_WP) {
      return null;
    }

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarExtendLostPasswordConfig)}
        key="forgot"
      >
        <div className="brz-form-login__field brz-form-login__field-lost-password">
          <TextEditor value={lostPassword} onChange={this.handleLinkChange} />
        </div>
      </Toolbar>
    );
  }

  renderRegisterLink(registerLink) {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarRegisterLink)}
        key="register"
      >
        <div className="brz-form-login__field brz-form-login__field-register-link">
          <TextEditor
            value={registerLink}
            onChange={this.handleRegisterLinkChange}
          />
        </div>
      </Toolbar>
    );
  }

  renderLoginLink(loginLink) {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarLoginLink)}
        key="login"
      >
        <div className="brz-form-login__field brz-form-login__field-login-link">
          <TextEditor value={loginLink} onChange={this.handleLoginLinkChange} />
        </div>
      </Toolbar>
    );
  }

  renderLoginForm(v) {
    const {
      showLostPassword,
      showRegisterLink,
      registerLink,
      lostPassword
    } = v;

    return (
      <>
        {this.renderLoginFields(v)}
        {this.renderButton(v.items.length, "login")}
        {showLostPassword === "on" &&
          this.renderLostYourPasswordLink(lostPassword)}
        {showRegisterLink === "on" &&
          this.canRegister() &&
          this.renderRegisterLink(registerLink)}
      </>
    );
  }

  renderRegisterForm(v) {
    const { showLostPassword, loginLink, showLoginLink, lostPassword } = v;

    return (
      <>
        {this.renderRegisterFields(v)}
        {this.renderButton(v.items.length, "register")}
        {showLoginLink === "on" && this.renderLoginLink(loginLink)}
        {showLostPassword === "on" &&
          this.renderLostYourPasswordLink(lostPassword)}
      </>
    );
  }

  renderForgotForm(v) {
    const { showRegisterLink, loginLink, showLoginLink, registerLink } = v;

    return (
      <>
        {this.renderForgotPasswordFields(v)}
        {this.renderButton(v.items.length, "forgot")}
        {showLoginLink === "on" && this.renderLoginLink(loginLink)}
        {showRegisterLink === "on" &&
          this.canRegister() &&
          this.renderRegisterLink(registerLink)}
      </>
    );
  }

  renderAuthorizedForm(v) {
    const redirectLogoutHref = `{{editor_logout_url}}&amp;redirect_to=${encodeURI(
      v.logoutRedirect
    )}`;
    const style = IS_EDITOR ? { pointerEvents: "none" } : {};

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarAutorized)}>
        <div className="brz-login__autorized">
          <DynamicContentHelper
            placeholder="{{editor_user_display_name}}"
            tagName="p"
          />
          <a style={style} href={redirectLogoutHref}>
            {" "}
            Logout
          </a>
        </div>
      </Toolbar>
    );
  }

  getActions(type) {
    switch (type) {
      case "register":
        return "{{editor_login_url}}?action=register";
      case "forgot":
        return "{{editor_login_url}}?action=lostpassword";
      default:
        return "{{editor_login_url}}";
    }
  }

  renderForm(v) {
    const { type } = v;

    const content =
      type === "login"
        ? this.renderLoginForm(v)
        : type === "register"
        ? this.renderRegisterForm(v)
        : type === "forgot"
        ? this.renderForgotForm(v)
        : undefined;

    if (IS_EDITOR) {
      if (type === "authorized") {
        return this.renderAuthorizedForm(v);
      } else {
        return <form className="brz-form-login">{content}</form>;
      }
    } else {
      return IS_WP ? (
        <>
          {this.renderAuthorizedForm(v)}

          <form
            className="brz-form-login brz-form-login-login"
            noValidate
            action={this.getActions("login")}
          >
            {this.renderLoginForm(v)}
          </form>

          {this.canRegister() && (
            <form
              className="brz-form-login brz-form-login-register"
              noValidate
              action={this.getActions("register")}
              method="post"
            >
              {this.renderRegisterForm(v)}
            </form>
          )}

          <form
            className="brz-form-login brz-form-login-forgot"
            noValidate
            action={this.getActions("forgot")}
            method="post"
          >
            {this.renderForgotForm(v)}
          </form>
        </>
      ) : (
        <>
          {this.renderAuthorizedForm(v)}

          <form className="brz-form-login brz-form-login-login" noValidate>
            {this.renderLoginForm(v)}
          </form>

          {this.canRegister() && (
            <form className="brz-form-login brz-form-login-register" noValidate>
              {this.renderRegisterForm(v)}
            </form>
          )}

          <form className="brz-form-login brz-form-login-forgot" noValidate>
            {this.renderForgotForm(v)}
          </form>
        </>
      );
    }
  }

  renderForEdit(v, vs, vd) {
    const { type } = v;
    const className = classnames(
      "brz-login",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: {
              "data-islogged": "{{editor_is_user_logged_in}}",
              "data-redirect": v.redirectType,
              "data-redirect-value": v.messageRedirect,
              "data-error-empty": v.emptyFieldsError,
              "data-error-url": v.submitUrlError,
              type
            }
          })}
        >
          {this.renderForm(v)}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Login;
