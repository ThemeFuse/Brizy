import React, { Component } from "react";

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
    required: "off",
    type: "Text"
  };

  content = React.createRef();

  handleTextChange = ({ target: { value: label } }) => {
    this.props.onChange({ label });
  };

  handleClick = e => {
    e.preventDefault();
    const node = this.content.current;

    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = this.content.current;

    node && node.classList.remove("brz-ed-dd-cancel");
  };

  renderForEdit(props) {
    return <input className="brz-input brz-forms__field" {...props} />;
  }

  renderForView(v) {
    return this.renderForEdit(v);
  }

  render() {
    const { _id, label, required, type } = this.props;

    let props;
    if (IS_EDITOR) {
      props = {
        ref: this.content,
        type: "text",
        value: label,
        onChange: this.handleTextChange,
        onClick: this.handleClick,
        onBlur: this.handleBlur
      };
    } else {
      props = {
        id: _id,
        name: _id,
        placeholder: label,
        required: required === "on",
        pattern: this.constructor.pattern,
        "data-type": type,
        "data-label": label
      };
    }

    return IS_EDITOR ? this.renderForEdit(props) : this.renderForView(props);
  }
}
