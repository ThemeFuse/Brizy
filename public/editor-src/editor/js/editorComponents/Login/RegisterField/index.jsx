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
        {v.type === "Name" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label " htmlFor="nameInput">
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
                    name="nameInput"
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
                    name="nameInput"
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
        {v.type === "RegisterPassword" && (
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
                {showLabel === "on" ? (
                  <input
                    className="brz-input brz-login__field brz-login__field-password"
                    type="password"
                    name="passwordInput"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    ref={this.input}
                    onChange={e => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    className="brz-input brz-login__field brz-login__field-password"
                    type="password"
                    name="passwordInput"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    ref={this.input}
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
        {v.type === "ConfirmPassword" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <Toolbar {...toolbarExtendLabel}>
                <div className="brz-login__field-label" style={styleLabel}>
                  <label className="brz-label" htmlFor="confirmPasswordInput">
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
                    className="brz-input brz-login__field brz-login__field-password"
                    type="password"
                    name="confirmPasswordInput"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    ref={this.input}
                    onChange={e => {
                      this.patchValue({
                        placeholder: e.target.value
                      });
                    }}
                  />
                ) : (
                  <input
                    className="brz-input brz-login__field brz-login__field-password"
                    type="password"
                    name="confirmPasswordInput"
                    placeholder={this.getPlaceholder(v)}
                    value={this.getPlaceholder(v)}
                    required
                    ref={this.input}
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
        {v.type === "Name" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label " htmlFor="nameInput">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="text"
                name="nameInput"
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
        {v.type === "RegisterPassword" && (
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
                name="passwordInput"
                className="brz-input brz-login__field brz-login__field-password"
                placeholder={this.getPlaceholder(v)}
                value=""
                required
              />
            </div>
          </div>
        )}
        {v.type === "ConfirmPassword" && (
          <div className="brz-login__item">
            {showLabel === "on" && (
              <div className="brz-login__field-label" style={styleLabel}>
                <label className="brz-label" htmlFor="confirmPasswordInput">
                  {this.getLabel(v)}
                </label>
              </div>
            )}
            <div className="brz-login__field">
              <input
                ref={this.input}
                type="password"
                name="confirmPasswordInput"
                className="brz-input brz-login__field brz-login__field-password"
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

export default RegisterField;
