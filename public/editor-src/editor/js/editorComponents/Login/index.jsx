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

class Login extends EditorComponent {
  static get componentId() {
    return "Login";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  getRegister = () => {
    return Config.get("wp").usersCanRegister === "1";
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentFn(this.getRegister()),
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
    return (
      <React.Fragment>
        <EditorArrayComponent {...fieldsProps} />
      </React.Fragment>
    );
  }

  renderRegisterFields(v) {
    const fieldsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 3,
      sliceEndIndex: 6,
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
    return (
      <React.Fragment>
        <EditorArrayComponent {...fieldsProps} />
      </React.Fragment>
    );
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
    return (
      <React.Fragment>
        <EditorArrayComponent {...fieldsProps} />
      </React.Fragment>
    );
  }

  renderButton() {
    const buttonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 7,
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

  renderLostYourPassword(v) {
    const { lostPassword } = v;
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

  renderRegisterLink(v) {
    const { registerLink } = v;

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

  renderLoginLink(v) {
    const { loginLink } = v;

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
    const { showLostPassword, showRegisterLink } = v;

    return (
      <React.Fragment>
        {this.renderLoginFields(v)}
        {this.renderButton(v)}
        {showLostPassword === "on" && this.renderLostYourPassword(v)}
        {showRegisterLink === "on" &&
          this.getRegister() &&
          this.renderRegisterLink(v)}
      </React.Fragment>
    );
  }

  renderRegisterForm(v) {
    const { showLostPassword, showLoginLink } = v;

    return (
      <React.Fragment>
        {this.renderRegisterFields(v)}
        {this.renderButton(v)}
        {showLoginLink === "on" && this.renderLoginLink(v)}
        {showLostPassword === "on" && this.renderLostYourPassword(v)}
      </React.Fragment>
    );
  }

  renderForgotForm(v) {
    const { showRegisterLink, showLoginLink } = v;

    return (
      <React.Fragment>
        {this.renderForgotPasswordFields(v)}
        {this.renderButton(v)}
        {showRegisterLink === "on" &&
          this.getRegister() &&
          this.renderRegisterLink(v)}
        {showLoginLink === "on" && this.renderLoginLink(v)}
      </React.Fragment>
    );
  }

  renderAuthorized(v) {
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

    const content =
      type === "login"
        ? this.renderLoginForm(v)
        : type === "register"
        ? this.renderRegisterForm(v)
        : type === "forgot"
        ? this.renderForgotForm(v)
        : undefined;

    const renderForm = v => {
      const { type } = v;

      if (IS_EDITOR) {
        if (type === "authorized") {
          return this.renderAuthorized(v);
        } else {
          return (
            <form
              className="brz-form-login"
              noValidate
              onSubmit={this.handleSubmit}
              action={this.getActions(type)}
              method="post"
            >
              <input
                type="hidden"
                name="redirect_to"
                value={v.messageRedirect === "" ? "/" : v.messageRedirect}
              />
              {content}
            </form>
          );
        }
      } else {
        return (
          <>
            {this.renderAuthorized(v)}
            <form
              className="brz-form-login brz-form-login-login"
              noValidate
              onSubmit={this.handleSubmit}
              action={this.getActions("login")}
              method="post"
            >
              <input
                type="hidden"
                name="redirect_to"
                value={v.messageRedirect === "" ? "/" : v.messageRedirect}
              />
              {this.renderLoginForm(v)}
            </form>
            {this.getRegister() && (
              <form
                className="brz-form-login brz-form-login-register"
                noValidate
                onSubmit={this.handleSubmit}
                action={this.getActions("register")}
                method="post"
              >
                <input
                  type="hidden"
                  name="redirect_to"
                  value={v.messageRedirect === "" ? "/" : v.messageRedirect}
                />
                {this.renderRegisterForm(v)}
              </form>
            )}
            <form
              className="brz-form-login brz-form-login-forgot"
              noValidate
              onSubmit={this.handleSubmit}
              action={this.getActions("forgot")}
              method="post"
            >
              <input
                type="hidden"
                name="redirect_to"
                value={v.messageRedirect === "" ? "/" : v.messageRedirect}
              />
              {this.renderForgotForm(v)}
            </form>
          </>
        );
      }
    };

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: {
              ["data-islogged"]: "{{editor_is_user_logged_in}}",
              type
            }
          })}
        >
          {renderForm(v)}
        </Wrapper>
      </CustomCSS>
    );
  }
}
export default Login;
