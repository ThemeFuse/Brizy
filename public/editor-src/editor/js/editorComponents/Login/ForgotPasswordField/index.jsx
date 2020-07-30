import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import defaultValue from "./defaultValue";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "visual/editorComponents/Login/LoginField/styles";

class ForgotPasswordField extends EditorComponent {
  static get componentId() {
    return "ForgotPasswordField";
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

  renderForEdit(v, vs, vd) {
    const { showLabel, toolbarExtendLabel } = this.props;
    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
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
        {v.type === "ResetEmail" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label " htmlFor="emailInput">
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
                    name="emailInput"
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
                    name="emailInput"
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
      </div>
    );
  }

  renderForView(v, vs, vd) {
    const { showLabel } = this.props;

    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
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
        {v.type === "ResetEmail" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label " htmlFor="emailInput">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="email"
                name="emailInput"
                className="brz-input brz-login__field-email"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ForgotPasswordField;
