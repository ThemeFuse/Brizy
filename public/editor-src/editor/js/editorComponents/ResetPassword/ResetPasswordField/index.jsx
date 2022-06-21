import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import defaultValue from "./defaultValue";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";

const readResetPasswordType = type => {
  switch (type) {
    case "Password":
    case "PasswordConfirm":
      return type;

    default:
      return undefined;
  }
};

class ResetPasswordField extends EditorComponent {
  static get componentId() {
    return "ResetPasswordField";
  }

  static defaultValue = defaultValue;

  state = {
    value: "",
    active: {}
  };

  handleActive = active => {
    this.setState({ active });
  };

  handleLabelChange = label => {
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

    if (IS_EDITOR) {
      return placeholder === null ? label : placeholder;
    }

    return placeholder === null || showLabel === "off" ? label : placeholder;
  }

  getFieldType(type) {
    switch (readResetPasswordType(type)) {
      case "Password":
      case "PasswordConfirm":
        return "password";
      case undefined:
        return "";
    }
  }

  getFieldName(type) {
    switch (readResetPasswordType(type)) {
      case "Password":
        return "password";
      case "PasswordConfirm":
        return "passwordConfirm";
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

  renderForEdit(v, vs, vd) {
    const { showLabel, toolbarExtendLabel } = this.props;

    const { type } = v;

    const className = classnames(
      "brz-reset-psw-form__field",
      `brz-reset-psw-form__field-${type}`,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const styleLabel = {
      height: v.label === "" ? 0 : "auto"
    };

    return (
      <div className={className}>
        {(type === "Password" || type === "PasswordConfirm") && (
          <div className="brz-reset-psw__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-reset-psw__field-label" style={styleLabel}>
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
              <div className="brz-reset-psw__field">
                <input
                  name="password"
                  className="brz-input"
                  type="text"
                  placeholder={this.getPlaceholder(v)}
                  value={this.getPlaceholder(v)}
                  required
                  onChange={e => {
                    showLabel === "on"
                      ? this.patchValue({
                          placeholder: e.target.value
                        })
                      : this.patchValue({
                          label: e.target.value,
                          placeholder: e.target.value
                        });
                  }}
                />
              </div>
            </Toolbar>
          </div>
        )}
      </div>
    );
  }

  renderForView(v, vs, vd) {
    const { showLabel } = this.props;
    const { type } = v;

    const className = classnames(
      "brz-reset-psw-form__field",
      `brz-reset-psw-form__field-${type}`,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const styleLabel = {
      height: v.label === "" ? 0 : "auto"
    };

    return (
      <div className={className}>
        {(type === "Password" || type === "PasswordConfirm") && (
          <div className="brz-reset-psw__item">
            {showLabel === "on" && (
              <div className="brz-reset-psw__field-label" style={styleLabel}>
                <label className="brz-label">{this.getLabel(v)}</label>
              </div>
            )}
            <div className="brz-reset-psw__field">
              <input
                type={this.getFieldType(type)}
                name={this.getFieldName(type)}
                className="brz-input"
                placeholder={this.getPlaceholder(v)}
                defaultValue=""
                required
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ResetPasswordField;
