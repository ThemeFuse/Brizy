import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { TextEditor } from "visual/component/Controls/TextEditor";
import defaultValue from "./defaultValue";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "visual/editorComponents/Login/LoginField/styles";
import CheckboxControls, {
  CheckGroupItem as CheckboxControlsItem
} from "visual/component/Controls/CheckGroup";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";

class LoginField extends EditorComponent {
  static get componentId() {
    return "LoginField";
  }

  static defaultValue = defaultValue;

  input = React.createRef();

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

  handleLabelRememberChange = label => {
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
    const { active } = this.state;
    const {
      remember,
      showLabel,
      toolbarExtendLabel,
      toolbarExtendCheckbox
    } = this.props;

    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
      `brz-form-login__field-remember-${remember}`,
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
        {v.type === "Email" && (
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
                <input
                  name="log"
                  ref={this.input}
                  className="brz-input brz-login__field-email"
                  type="text"
                  id="user"
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
        {v.type === "Password" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label" htmlFor="passwordInput">
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
                <input
                  className="brz-input brz-login__field brz-login__field-password"
                  type="password"
                  name="pwd"
                  id="password"
                  placeholder={this.getPlaceholder(v)}
                  value={this.getPlaceholder(v)}
                  required
                  ref={this.input}
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
        {v.type === "Remember" && remember === "on" && (
          <div className="brz-login__item">
            <Toolbar {...toolbarExtendCheckbox}>
              <CheckboxControls
                defaultValue={active}
                onChange={this.handleActive}
              >
                <CheckboxControlsItem
                  name="rememberme"
                  value="forever"
                  renderIcons={this.renderIconForEdit}
                >
                  <TextEditor
                    value={this.getLabel(v)}
                    onChange={this.handleLabelRememberChange}
                  />
                </CheckboxControlsItem>
              </CheckboxControls>
            </Toolbar>
          </div>
        )}
      </div>
    );
  }

  renderForView(v, vs, vd) {
    const { remember, showLabel } = this.props;

    const className = classnames(
      "brz-form-login__field",
      `brz-form-login__field-${v.type}`,
      `brz-form-login__field-remember-${remember}`,
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
        {v.type === "Email" && (
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
                type="text"
                name="log"
                id="user"
                className="brz-input brz-login__field-email"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
        {v.type === "Password" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label" htmlFor="passwordInput">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="password"
                name="pwd"
                id="password"
                className="brz-input brz-login__field brz-login__field-password"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
        {v.type === "Remember" && remember === "on" && (
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
}

export default LoginField;
