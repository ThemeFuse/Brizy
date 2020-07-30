import React, { Component } from "react";
import classnames from "classnames";
import { uuid } from "visual/utils/uuid";

export default class TextField extends Component {
  static get componentTitle() {
    return "Text";
  }

  static get componentType() {
    return "Text";
  }

  static defaultProps = {
    _id: null,
    label: "Default Label",
    labelType: "inside",
    required: "off",
    type: "Text",
    selectToolbarItems: null
  };

  static Label({ id, value, onChange }) {
    const { label, placeholder: _placeholder } = value;

    return IS_EDITOR ? (
      <label className="brz-label brz-forms2__field-label">
        <div className="brz-p-relative">
          <input
            className="brz-input brz-p-absolute"
            type="text"
            value={label}
            placeholder={_placeholder === null ? label : _placeholder}
            onChange={e => {
              onChange({ label: e.target.value });
            }}
          />
          <span className="brz-invisible">{label}</span>
        </div>
      </label>
    ) : (
      <label className="brz-label brz-forms2__field-label" htmlFor={id}>
        {label}
      </label>
    );
  }

  input = React.createRef();

  getClassName(v) {
    const { attr, showPlaceholder } = v;

    return classnames(
      `brz-input brz-forms2__field brz-forms2__field-${attr.type}`,
      { "brz-p-events--none": IS_EDITOR && !showPlaceholder }
    );
  }

  getPlaceholder() {
    const { showPlaceholder, placeholder, label, labelType } = this.props;

    if (!showPlaceholder) {
      return "";
    }

    if (IS_EDITOR) {
      return placeholder === null ? label : placeholder;
    }

    return placeholder === null || labelType === "inside" ? label : placeholder;
  }

  getValue() {
    const { showPlaceholder, label } = this.props;

    return showPlaceholder ? label : "";
  }

  getAttributes() {
    return {};
  }

  handleChange = value => {
    this.props.onChange(value);
  };

  handleClick = e => {
    e.preventDefault();
    const node = this.input.current;
    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = this.input.current;
    node && node.classList.remove("brz-ed-dd-cancel");
  };

  renderForEdit(v) {
    const { labelType, attr } = v;

    return labelType === "outside" ? (
      <input
        {...attr}
        ref={this.input}
        className={this.getClassName(v)}
        value={attr.placeholder}
        onChange={e => {
          this.handleChange({ placeholder: e.target.value });
        }}
      />
    ) : (
      <input
        {...attr}
        ref={this.input}
        className={this.getClassName(v)}
        onChange={e => {
          this.handleChange({
            label: e.target.value,
            placeholder: e.target.value
          });
        }}
      />
    );
  }

  renderForView(v) {
    const { attr } = v;

    return <input {...attr} className={this.getClassName(v)} />;
  }

  render() {
    const {
      _id,
      label,
      labelType,
      showPlaceholder,
      required,
      type,
      columns,
      options,
      tabletColumns,
      mobileColumns
    } = this.props;
    if (IS_EDITOR) {
      const props = {
        options,
        label,
        labelType,
        showPlaceholder,
        columns,
        tabletColumns,
        mobileColumns,
        attr: {
          type: "text",
          value: this.getValue(),
          placeholder: this.getPlaceholder(),
          onClick: this.handleClick,
          onBlur: this.handleBlur
        }
      };

      return this.renderForEdit(props);
    } else {
      const props = {
        options,
        label,
        labelType,
        showPlaceholder,
        columns,
        tabletColumns,
        mobileColumns,
        attr: {
          type: type.toLocaleLowerCase(),
          id: uuid(),
          name: _id,
          placeholder: this.getPlaceholder(),
          required: required === "on",
          pattern:
            this.constructor.pattern && encodeURI(this.constructor.pattern),
          "data-type": type,
          "data-label": label,
          "data-placeholder": this.getPlaceholder(),
          ...this.getAttributes()
        }
      };

      return this.renderForView(props);
    }
  }
}
