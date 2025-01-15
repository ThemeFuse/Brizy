import classnames from "classnames";
import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { style } from "visual/editorComponents/Login/LoginField/styles";
import { isWp } from "visual/global/Config";
import defaultValue from "./defaultValue";
import * as toolbarConfig from "./toolbar";

const readRegisterWpType = (type) => {
  switch (type) {
    case "Name":
    case "RegisterEmail":
      return type;

    default:
      return undefined;
  }
};

const readRegisterCloudType = (type) => {
  switch (type) {
    case "FirstName":
    case "LastName":
    case "Username":
    case "RegisterEmail":
    case "Password":
    case "PasswordConfirm":
    case "Phone":
      return type;

    default:
      return undefined;
  }
};

class RegisterField extends EditorComponent {
  static get componentId() {
    return "RegisterField";
  }

  static defaultValue = defaultValue;

  isWp = isWp(this.getGlobalConfig());

  handleLabelChange = (label) => {
    this.patchValue({ label });
  };

  getLabel(v) {
    const { label } = v;

    return label === null ? "" : label;
  }

  getPlaceholder(v) {
    const { placeholder, label } = v;
    const { showPlaceholder, showLabel } = this.props;

    if (showPlaceholder === "off") {
      return "";
    }

    if (isEditor(this.renderContext)) {
      return placeholder === null ? label : placeholder;
    }

    return placeholder === null || showLabel === "off" ? label : placeholder;
  }

  getWpFieldType(type) {
    switch (readRegisterWpType(type)) {
      case "Name":
        return "text";
      case "RegisterEmail":
        return "email";
      case undefined:
        return "";
    }
  }

  getWpFieldName(type) {
    switch (readRegisterWpType(type)) {
      case "Name":
        return "user_login";
      case "RegisterEmail":
        return "user_email";
      case undefined:
        return "";
    }
  }

  getCloudFieldType(type) {
    switch (readRegisterCloudType(type)) {
      case "FirstName":
      case "LastName":
      case "Username":
      case "Phone":
        return "text";
      case "RegisterEmail":
        return "email";
      case "Password":
      case "PasswordConfirm":
        return "password";
      case undefined:
        return "";
    }
  }

  getCloudFieldName(type) {
    switch (readRegisterCloudType(type)) {
      case "FirstName":
        return "firstName";
      case "LastName":
        return "lastName";
      case "Username":
        return "userName";
      case "RegisterEmail":
        return "email";
      case "Password":
        return "password";
      case "PasswordConfirm":
        return "passwordConfirm";
      case "Phone":
        return "phone";
      case undefined:
        return "";
    }
  }

  renderIconForEdit = ({ active }) => {
    return (
      <div className="brz-control__check-group-icon">
        <EditorIcon
          className="brz-d-block"
          icon={active ? "nc-check-square-on" : "nc-check-square-off"}
        />
      </div>
    );
  };

  renderIconForView = () => {
    return (
      <>
        <div className="brz-control__check-group-icon brz-control__check-group--check">
          <ThemeIcon
            className="brz-d-block"
            name="check-square-on"
            type="editor"
          />
        </div>
        <div className="brz-control__check-group-icon brz-control__check-group--uncheck">
          <ThemeIcon
            className="brz-d-block"
            name="check-square-off"
            type="editor"
          />
        </div>
      </>
    );
  };

  renderRegisterInfoForEdit(v, showRegisterInfo, toolbarRegisterInfo) {
    const { type } = v;
    return (
      type === "RegisterInfo" &&
      showRegisterInfo === "on" && (
        <div className="brz-login__item">
          <Toolbar {...toolbarRegisterInfo}>
            <div className="brz-login__register-info">
              <TextEditor
                value={this.getLabel(v)}
                onChange={this.handleLabelChange}
              />
            </div>
          </Toolbar>
        </div>
      )
    );
  }

  renderRegisterInfoForView(v, showRegisterInfo) {
    const { type } = v;
    return (
      type === "RegisterInfo" &&
      showRegisterInfo === "on" && (
        <div className="brz-login__item">
          <div className="brz-login__register-info">{this.getLabel(v)}</div>
        </div>
      )
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      showLabel,
      toolbarExtendLabel,
      toolbarRegisterInfo,
      showRegisterInfo,

      showFirstName,
      showLastName,
      showUsername,
      showPhoneNumber
    } = this.props;
    const { type } = v;
    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${type}`,
      {
        "brz-login-form__field-registerInfo-off":
          showRegisterInfo === "off" && type === "RegisterInfo"
      },
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const styleLabel = {
      height: v.label === "" ? 0 : "auto"
    };
    return this.isWp ? (
      <div className={className}>
        {(type === "Name" || type === "RegisterEmail") && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label">
                    <TextEditor
                      value={this.getLabel(v)}
                      onChange={this.handleLabelChange}
                    />
                  </label>
                </div>
              </Toolbar>
            )}
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
              <div className="brz-login__field">
                {showLabel === "on" ? (
                  <input
                    className="brz-input"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    onChange={(e) => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    className="brz-input"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    onChange={(e) => {
                      this.patchValue({
                        label: e.target.value,
                        placeholder: e.target.value
                      });
                    }}
                  />
                )}
              </div>
            </Toolbar>
          </div>
        )}
        {this.renderRegisterInfoForEdit(
          v,
          showRegisterInfo,
          toolbarRegisterInfo
        )}
      </div>
    ) : (
      ((type === "FirstName" && showFirstName === "on") ||
        (type === "LastName" && showLastName === "on") ||
        (type === "Username" && showUsername === "on") ||
        type === "RegisterEmail" ||
        type === "Password" ||
        type === "PasswordConfirm" ||
        (type === "Phone" && showPhoneNumber === "on")) && (
        <div className={className}>
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label">
                    <TextEditor
                      value={this.getLabel(v)}
                      onChange={this.handleLabelChange}
                    />
                  </label>
                </div>
              </Toolbar>
            )}
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
              <div className="brz-login__field">
                {showLabel === "on" ? (
                  <input
                    className="brz-input"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    onChange={(e) => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    className="brz-input"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    onChange={(e) => {
                      this.patchValue({
                        label: e.target.value,
                        placeholder: e.target.value
                      });
                    }}
                  />
                )}
              </div>
            </Toolbar>
          </div>
        </div>
      )
    );
  }

  renderForView(v, vs, vd) {
    const {
      showLabel,
      showRegisterInfo,

      showFirstName,
      showLastName,
      showUsername,
      showPhoneNumber
    } = this.props;
    const { type } = v;

    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${type}`,
      {
        "brz-login-form__field-registerInfo-off":
          showRegisterInfo === "off" && type === "RegisterInfo"
      },
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const styleLabel = {
      height: v.label === "" ? 0 : "auto"
    };
    return this.isWp ? (
      <div className={className}>
        {(type === "Name" || type === "RegisterEmail") && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label">{this.getLabel(v)}</label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                type={this.getWpFieldType(type)}
                name={this.getWpFieldName(type)}
                maxLength={
                  this.getWpFieldType(type) === "email" ? 255 : undefined
                }
                className="brz-input"
                placeholder={this.getPlaceholder(v)}
                defaultValue=""
                required
              />
            </div>
          </div>
        )}
        {this.renderRegisterInfoForView(v, showRegisterInfo)}
      </div>
    ) : (
      ((type === "FirstName" && showFirstName === "on") ||
        (type === "LastName" && showLastName === "on") ||
        (type === "Username" && showUsername === "on") ||
        type === "RegisterEmail" ||
        type === "Password" ||
        type === "PasswordConfirm" ||
        (type === "Phone" && showPhoneNumber === "on")) && (
        <div className={className}>
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label">{this.getLabel(v)}</label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                type={this.getCloudFieldType(type)}
                name={this.getCloudFieldName(type)}
                maxLength={
                  this.getCloudFieldType(type) === "email" ? 255 : undefined
                }
                className="brz-input"
                placeholder={this.getPlaceholder(v)}
                defaultValue=""
                required={
                  type === "RegisterEmail" ||
                  type === "Password" ||
                  type === "PasswordConfirm"
                }
              />
            </div>
          </div>
        </div>
      )
    );
  }
}

export default RegisterField;
