import React from "react";
import _ from "underscore";
import classnames from "classnames";

const keyCodes = {
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  B: 66,
  I: 73,
  U: 85,
  V: 86
};

class Editor extends React.Component {
  static defaultProps = {
    className: "",
    value: "Editable Text",
    pattern: null,
    onChange: _.noop
  };

  content = React.createRef();

  componentWillMount() {
    this.onChange = _.debounce(value => {
      if (this.mounted) {
        this.props.onChange(value);
      }
    }, 1000);
  }

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleBlur = () => {
    const node = this.content.current;

    if (node) {
      node.removeAttribute("contentEditable", "true");
      node.classList.remove("brz-ed-dd-cancel");
    }
  };

  handleClick = e => {
    e.preventDefault();

    const node = this.content.current;

    if (node) {
      node.setAttribute("contentEditable", "true");
      node.classList.add("brz-ed-dd-cancel");
      node.focus();
    }
  };

  handleInput = e => {
    this.notifyChange(e.target.textContent);
  };

  handleKeyDown = e => {
    const keyCode = e.which;
    const holdsMeta = e.metaKey || e.ctrlKey;

    // prevent enter
    if (keyCode === keyCodes.ENTER) {
      e.preventDefault();
      return;
    }

    // prevent paste
    if (holdsMeta && keyCode === keyCodes.V) {
      e.preventDefault();
      return;
    }

    // prevent ctrl + {B,I,U}
    if (
      holdsMeta &&
      (keyCode === keyCodes.B ||
        keyCode === keyCodes.I ||
        keyCode === keyCodes.U)
    ) {
      e.preventDefault();
      return;
    }

    // Pattern
    if (
      this.props.pattern &&
      (keyCode !== keyCodes.BACKSPACE &&
        keyCode !== keyCodes.DELETE &&
        keyCode !== keyCodes.ARROW_LEFT &&
        keyCode !== keyCodes.ARROW_RIGHT) &&
      !this.props.pattern.test(String.fromCharCode(keyCode))
    ) {
      e.preventDefault();
      return;
    }
  };

  render() {
    const { className: _className, value } = this.props;
    console.dir({ value });
    const className = classnames(
      "brz-span brz-ed-control--text__editor",
      _className
    );
    return (
      <span
        ref={this.content}
        className={className}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
        onBlur={this.handleBlur}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }
}

export default Editor;
