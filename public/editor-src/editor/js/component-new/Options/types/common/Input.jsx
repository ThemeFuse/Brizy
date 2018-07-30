import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classnames from "classnames";

export default class Input extends React.Component {
  static defaultProps = {
    value: "",
    placeholder: "",
    className: "",
    onFocus: _.noop,
    onChange: _.noop,
    onEnterKeyDown: _.noop
  };

  componentDidMount() {
    this.handleFocus();
  }

  handleFocus = () => {
    const input = ReactDOM.findDOMNode(this);
    const len = input.value.length;

    // little hack to focus the input at the end of it's text
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(len, len);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd("character", len);
      range.moveStart("character", len);
    }

    this.props.onFocus();
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.props.onEnterKeyDown();
    }
  };

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const className = classnames("brz-input", this.props.className);

    return (
      <input
        className={className}
        type="text"
        placeholder={this.props.placeholder}
        value={this.props.value}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
      />
    );
  }
}
