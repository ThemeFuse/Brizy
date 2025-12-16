import classnames from "classnames";
import React from "react";
import { CheckGroup as CheckboxControls } from "visual/component/Controls/CheckGroup";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { Translate } from "visual/component/Translate";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { style } from "visual/editorComponents/Login/LoginField/styles";
import { isWp } from "visual/global/Config";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import defaultValue from "./defaultValue";
import * as toolbarConfig from "./toolbar";

const readLoginType = (type) => {
  switch (type) {
    case "Email":
    case "Password":
    case "Remember":
      return type;

    default:
      return undefined;
  }
};

const getFieldType = (type) => {
  switch (type) {
    case "Email":
      return "text";
    case "Password":
      return "password";
  }
};

const getFieldName = (type, isWp) => {
  switch (type) {
    case "Email":
      return isWp ? "log" : "email";
    case "Password":
      return isWp ? "pwd" : "password";
  }
};

class LoginField extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    value: "",
    active: {}
  };
  isWp = isWp(this.getGlobalConfig());

  static get componentId() {
    return ElementTypes.LoginField;
  }

  handleActive = (active) => {
    this.setState({ active });
  };

  handleLabelChange = (label) => {
    this.patchValue({ label });
  };

  handleLabelRememberChange = (label) => {
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
    const { active } = this.state;
    const { remember, showLabel, toolbarExtendLabel, toolbarExtendCheckbox } =
      this.props;

    const { type } = v;

    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${type}`,
      `brz-login-form__field-remember-${remember}`,
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
    const _type = readLoginType(type);

    if (_type) {
      return (
        <div className={className}>
          {(type === "Email" || type === "Password") && (
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
                    <input
                      name={this.isWp ? "log" : "email"}
                      className="brz-input"
                      type="text"
                      placeholder={this.getPlaceholder(v)}
                      value={this.getPlaceholder(v)}
                      required
                      onChange={(e) => {
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
                )}
              </Toolbar>
            </div>
          )}
          {type === "Remember" && remember === "on" && (
            <div className="brz-login__item">
              <Toolbar {...toolbarExtendCheckbox}>
                {({ ref }) => (
                  <CheckboxControls
                    defaultValue={active}
                    onChange={this.handleActive}
                    ref={ref}
                  >
                    <CheckboxControlsItem
                      name="rememberme"
                      value="forever"
                      isEditor={true}
                      renderIcons={this.renderIconForEdit}
                    >
                      <TextEditor
                        value={this.getLabel(v)}
                        onChange={this.handleLabelRememberChange}
                      />
                    </CheckboxControlsItem>
                  </CheckboxControls>
                )}
              </Toolbar>
            </div>
          )}
        </div>
      );
    }

    return null;
  }

  renderForView(v, vs, vd) {
    const { remember, showLabel } = this.props;
    const { type } = v;

    const className = classnames(
      "brz-login-form__field",
      `brz-login-form__field-${type}`,
      `brz-login-form__field-remember-${remember}`,
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

    const _type = readLoginType(type);
    const isEmail = type === "Email";

    if (_type) {
      return (
        <div className={className}>
          {(type === "Email" || type === "Password") && (
            <div className="brz-login__item">
              {showLabel === "on" && (
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label">{this.getLabel(v)}</label>
                </div>
              )}
              <Translate className="brz-login__field">
                <input
                  type={getFieldType(_type)}
                  maxLength={isEmail ? 255 : undefined}
                  name={getFieldName(_type, this.isWp)}
                  className="brz-input"
                  placeholder={this.getPlaceholder(v)}
                  defaultValue=""
                  required
                />
              </Translate>
            </div>
          )}
          {_type === "Remember" && remember === "on" && (
            <div className="brz-login__item">
              <CheckboxControls>
                <CheckboxControlsItem
                  name="rememberme"
                  value="forever"
                  renderIcons={this.renderIconForView}
                >
                  {this.getLabel(v)}
                </CheckboxControlsItem>
              </CheckboxControls>
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}

export default LoginField;
