import classnames from "classnames";
import React from "react";
import { noop } from "underscore";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import * as sidebarExtendButton from "visual/editorComponents/Login/sidebarExtendButton";
import * as toolbarAutorized from "visual/editorComponents/Login/toolbarAutorized";
import * as toolbarExtendButton from "visual/editorComponents/Login/toolbarExtendButton";
import * as toolbarLoginLink from "visual/editorComponents/Login/toolbarLoginLink";
import * as toolbarRegisterInfo from "visual/editorComponents/Login/toolbarRegisterInfo";
import * as toolbarRegisterLink from "visual/editorComponents/Login/toolbarRegisterLink";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import Config from "visual/global/Config";
import { css } from "visual/utils/cssStyle";
import { IS_WP } from "visual/utils/env";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarAutorized from "./sidebarAutorized";
import * as sidebarExtendLostPassword from "./sidebarAutorized";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as sidebarLoginLink from "./sidebarLoginLink";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendCheckbox from "./toolbarExtendCheckbox";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as toolbarExtendLostPasswordConfig from "./toolbarExtendLostPassword";
import toolbarExtendParentFn from "./toolbarExtendParent";

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

  handleResizerChange = (patch) => this.patchValue(patch);

  handleLinkChange = (lostPassword) => {
    this.patchValue({ lostPassword });
  };

  handleRegisterLinkChange = (registerLink) => {
    this.patchValue({ registerLink });
  };

  handleLoginLinkChange = (loginLink) => {
    this.patchValue({ loginLink });
  };

  handleSubmit = (e) => {
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
      endIndex: 18
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
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          {
            allowExtend: false
          }
        ),
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
          { allowExtend: false }
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
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          { allowExtend: false }
        ),
        showLabel: v.showLabel,
        showPlaceholder: v.showPlaceholder,
        remember: v.remember,
        showRegisterInfo: v.showRegisterInfo,

        showFirstName: v.showFirstName,
        showLastName: v.showLastName,
        showUsername: v.showUsername,
        showPhoneNumber: v.showPhoneNumber
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
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          {
            allowExtend: false
          }
        ),
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
      <div className="brz-login-form__field brz-login__item-button">
        <div className="brz-login__item brz-align-self-xs-end">
          <EditorArrayComponent {...buttonsProps} />
        </div>
      </div>
    );
  }

  renderLostYourPasswordLink(lostPassword) {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendLostPasswordConfig,
          sidebarExtendLostPassword
        )}
        key="forgot"
      >
        <div className="brz-login-form__field brz-login-form__field-lost-password">
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
        <div className="brz-login-form__field brz-login-form__field-register-link">
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
        {...this.makeToolbarPropsFromConfig2(
          toolbarLoginLink,
          sidebarLoginLink
        )}
        key="login"
      >
        <div className="brz-login-form__field brz-login-form__field-login-link">
          <TextEditor value={loginLink} onChange={this.handleLoginLinkChange} />
        </div>
      </Toolbar>
    );
  }

  renderLoginForm(v) {
    const { showLostPassword, showRegisterLink, registerLink, lostPassword } =
      v;

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
    const renderLink = () => {
      if (IS_WP) {
        const { logoutRedirectType, logoutRedirect } = v;

        const redirectLogoutHref = `{{editor_logout_url redirect="${
          logoutRedirectType === "samePage" ? "samePage" : logoutRedirect
        }"}}`;

        return (
          <a className="brz-login__authorized-link" href={redirectLogoutHref}>
            {" "}
            Logout
          </a>
        );
      }

      return <span className="brz-login__authorized-link"> Logout</span>;
    };

    const fallbackComponent = <p>John Doe</p>;

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarAutorized,
          sidebarAutorized
        )}
      >
        <div className="brz-login__authorized">
          {v.showName === "on" && (
            <DynamicContentHelper
              placeholder="{{editor_user_display_name}}"
              tagName="p"
              fallbackComponent={fallbackComponent}
            />
          )}
          {renderLink()}
        </div>
      </Toolbar>
    );
  }

  getActions(type) {
    switch (type) {
      case "register":
        return "{{editor_registration_url}}";
      case "forgot":
        return "{{editor_lostpassword_url}}";
      default:
        return "{{editor_login_url}}";
    }
  }

  renderFormForView(v) {
    const { defaultRoles } = v;

    const getDefaultRoles = () => {
      try {
        return JSON.stringify(
          JSON.parse(defaultRoles)?.map((item) => ({ id: item }))
        );
      } catch {
        return [];
      }
    };

    return (
      <>
        {this.renderAuthorizedForm(v)}

        <form className="brz-login-form brz-login-form__login" noValidate>
          {this.renderLoginForm(v)}
        </form>

        <form
          className="brz-login-form brz-login-form__register"
          noValidate
          data-defaultrole={getDefaultRoles()}
        >
          {this.renderRegisterForm(v)}
        </form>

        <form className="brz-login-form brz-login-form__forgot" noValidate>
          {this.renderForgotForm(v)}
        </form>
      </>
    );
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {type === "authorized" ? (
            this.renderAuthorizedForm(v)
          ) : (
            <form className="brz-login-form">{content}</form>
          )}
        </Wrapper>
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
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
              "data-error-passlength": v.passLengthError,
              "data-error-passmatch": v.passMatchError,
              type
            }
          })}
        >
          {this.renderFormForView(v)}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Login;
