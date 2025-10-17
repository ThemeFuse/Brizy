import classnames from "classnames";
import React, { Component } from "react";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { makeDataAttr } from "visual/utils/i18n/attribute";

function isExistingType(value) {
  const types = [
    "button",
    "checkbox",
    "color",
    "date",
    "email",
    "file",
    "hidden",
    "number",
    "password",
    "radio",
    "tel",
    "text",
    "time",
    "url"
  ];
  return types.includes(String(value.toLowerCase()));
}
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
    defaultValue: undefined,
    selectToolbarItems: null
  };

  input = React.createRef();

  getClassName(v) {
    const { attr } = v;

    return `brz-input brz-forms2__field brz-forms2__field-${attr.type}`;
  }

  getPlaceholder() {
    const { showPlaceholder, placeholder, label, labelType } = this.props;

    if (!showPlaceholder) {
      return "";
    }

    if (isEditor(this.props.renderContext)) {
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

  handleChange = (value) => {
    this.props.onChange(value);
  };

  handleClick = (e) => {
    e.preventDefault();
    const node = this.input.current;
    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = this.input.current;
    node && node.classList.remove("brz-ed-dd-cancel");
  };

  renderForEdit(v) {
    const { labelType, attr, showPlaceholder } = v;

    const className = classnames(this.getClassName(v), {
      "brz-p-events--none": !showPlaceholder
    });

    return labelType === "outside" ? (
      <input
        {...attr}
        ref={this.input}
        className={className}
        value={attr.placeholder}
        onChange={(e) => {
          this.handleChange({ placeholder: e.target.value });
        }}
      />
    ) : (
      <input
        {...attr}
        ref={this.input}
        className={className}
        onChange={(e) => {
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
      name,
      label,
      labelType,
      defaultValue,
      showPlaceholder,
      required,
      type,
      columns,
      options,
      tabletColumns,
      mobileColumns,
      labelId,
      renderContext,
      calculatedText
    } = this.props;

    if (isEditor(renderContext)) {
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
        },
        ...(type === ElementTypes.Calculated ? { calculatedText } : {})
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
          ...(isExistingType(type) ? { type: type.toLocaleLowerCase() } : ""),
          id: labelId,
          name: name,
          defaultValue,
          placeholder: this.getPlaceholder(),
          required: required === "on",
          pattern:
            this.constructor.pattern && encodeURI(this.constructor.pattern),
          ...makeDataAttr({ name: "type", value: type }),
          ...makeDataAttr({ name: "label", value: label }),
          ...makeDataAttr({
            name: "placeholder",
            value: this.getPlaceholder()
          }),
          ...this.getAttributes()
        },
        ...(type === ElementTypes.Calculated ? { calculatedText } : {})
      };

      return this.renderForView(props);
    }
  }
}
