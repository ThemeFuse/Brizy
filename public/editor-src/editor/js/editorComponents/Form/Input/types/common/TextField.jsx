import React, { Component } from "react";
import ReactDOM from "react-dom";

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

  handleTextChange = ({ target: { value: label } }) => {
    this.props.onChange({ label });
  };

  handleClick = e => {
    e.preventDefault();
    const node = ReactDOM.findDOMNode(this);
    node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = ReactDOM.findDOMNode(this);
    node.classList.remove("brz-ed-dd-cancel");
  };

  renderForEdit(props) {
    return <input className="brz-input brz-form__field" {...props} />;
  }

  renderForView(v) {
    return this.renderForEdit(v);
  }

  render() {
    const { _id, label, required, type } = this.props;

    let props;
    if (IS_EDITOR) {
      props = {
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

    let content;
    if (IS_EDITOR) {
      content = this.renderForEdit(props);
    }

    if (IS_PREVIEW) {
      content = this.renderForView(props);
    }

    return content;
  }
}
