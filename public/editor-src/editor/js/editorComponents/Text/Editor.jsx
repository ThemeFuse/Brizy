import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import classnames from "classnames";

const keyCodes = {
  ENTER: 13,
  B: 66,
  I: 73,
  U: 85,
  V: 86,
  Y: 89,
  Z: 90
};

class TextEditor extends Component {
  static defaultProps = {
    className: "",
    value: t("Editable Text")
  };

  content = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    const node = this.content.current;

    if (node && nextProps.value !== node.textContent) {
      node.textContent = nextProps.value;
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleClick = e => {
    e.preventDefault();

    const node = this.content.current;

    // issue - https://github.com/bagrinsergiu/blox-editor/issues/1848
    // What does it need for?
    // node.setAttribute("contentEditable", "true");
    node && node.classList.add("brz-ed-dd-cancel");
    // node.focus();
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

    // prevent undo / redo
    if (holdsMeta && (keyCode === keyCodes.Z || keyCode === keyCodes.Y)) {
      e.preventDefault();
      return;
    }
  };

  handleInput = e => {
    this.notifyChange(e.target.textContent);
  };

  handleBlur = () => {
    const node = this.content.current;

    // node.removeAttribute("contentEditable", "true");
    node && node.classList.remove("brz-ed-dd-cancel");
  };

  notifyChange = _.debounce(value => {
    if (this.mounted) {
      this.props.onChange(value);
    }
  }, 1000);

  render() {
    const className = classnames(
      "brz-span brz-text__editor",
      this.props.className
    );

    return (
      <span
        ref={this.content}
        className={className}
        contentEditable={IS_EDITOR}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
        onBlur={this.handleBlur}
        dangerouslySetInnerHTML={{ __html: this.props.value }}
      />
    );
  }
}

export default TextEditor;
