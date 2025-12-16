import classnames from "classnames";
import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { style } from "visual/editorComponents/Login/LoginField/styles";
import { isWp } from "visual/global/Config";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import defaultValue from "./defaultValue";
import * as toolbarConfig from "./toolbar";

class ForgotPasswordField extends EditorComponent {
  static defaultValue = defaultValue;
  isWp = isWp(this.getGlobalConfig());

  static get componentId() {
    return ElementTypes.ForgotPasswordField;
  }

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

    if (isEditor(this.props.renderContext)) {
      return placeholder === null ? label : placeholder;
    }

    return placeholder === null || showLabel === "off" ? label : placeholder;
  }

  renderForEdit(v, vs, vd) {
    const { showLabel, toolbarExtendLabel } = this.props;
    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${v.type}`,
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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
                {({ ref }) => (
                  <div
                    className="brz-login__field-label"
                    style={styleLabel}
                    ref={ref}
                  >
                    <label className="brz-label">
                      <TextEditor
                        value={this.getLabel(v)}
                        onChange={this.handleLabelChange}
                      />
                    </label>
                  </div>
                )}
              </Toolbar>
            )}
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
              {({ ref }) => (
                <div className="brz-login__field" ref={ref}>
                  {showLabel === "on" ? (
                    <input
                      className="brz-input"
                      type="email"
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
                      type="email"
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
              )}
            </Toolbar>
          </div>
        )}
      </div>
    );
  }

  renderForView(v, vs, vd) {
    const { showLabel } = this.props;

    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${v.type}`,
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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
                <label className="brz-label">{this.getLabel(v)}</label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                type="email"
                maxLength="255"
                name={this.isWp ? "user_login" : "email"}
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

export default ForgotPasswordField;
