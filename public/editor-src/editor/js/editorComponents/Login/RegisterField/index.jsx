import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import defaultValue from "./defaultValue";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "visual/editorComponents/Login/LoginField/styles";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";

class RegisterField extends EditorComponent {
  static get componentId() {
    return "RegisterField";
  }

  static defaultValue = defaultValue;

  input = React.createRef();

  state = {
    value: ""
  };

  handleLabelChange = label => {
    this.patchValue({ label });
  };

  getLabel(v) {
    const { label } = v;

    if (IS_EDITOR) {
      return label === null ? "" : label;
    }

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
    const {
      showLabel,
      toolbarExtendLabel,
      toolbarRegisterInfo,
      showRegisterInfo
    } = this.props;
    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
      {
        "brz-form-login__field-registerInfo-off":
          showRegisterInfo === "off" && v.type === "RegisterInfo"
      },
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
        {v.type === "Name" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label " htmlFor="user_login">
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
                    name="user_login"
                    ref={this.input}
                    className="brz-input brz-login__field-name"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    onChange={e => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    name="user_login"
                    ref={this.input}
                    className="brz-input brz-login__field-name"
                    type="text"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    onChange={e => {
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
        {v.type === "RegisterEmail" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label " htmlFor="user_email">
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
                    name="user_email"
                    ref={this.input}
                    className="brz-input brz-login__field-email"
                    type="email"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    onChange={e => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    name="user_email"
                    ref={this.input}
                    className="brz-input brz-login__field-email"
                    type="email"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    onChange={e => {
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
        {v.type === "RegisterInfo" && showRegisterInfo === "on" && (
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
        )}
      </div>
    );
  }
  renderForView(v, vs, vd) {
    const { showLabel, showRegisterInfo } = this.props;
    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
      {
        "brz-form-login__field-registerInfo-off":
          showRegisterInfo === "off" && v.type === "RegisterInfo"
      },
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
        {v.type === "Name" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label " htmlFor="user_login">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="text"
                name="user_login"
                className="brz-input brz-login__field-name"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
        {v.type === "RegisterEmail" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label " htmlFor="user_email">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="email"
                name="user_email"
                className="brz-input brz-login__field-email"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
        {v.type === "RegisterInfo" && showRegisterInfo === "on" && (
          <div className="brz-login__item">
            <div className="brz-login__register-info">{this.getLabel(v)}</div>
          </div>
        )}
      </div>
    );
  }
}
export default RegisterField;
