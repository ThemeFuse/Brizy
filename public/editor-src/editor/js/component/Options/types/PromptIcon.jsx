import React from "react";
import _ from "underscore";
import classnames from "classnames";
import UIState from "visual/global/UIState";
import EditorIcon from "visual/component/EditorIcon";

class PromptIconOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-grid-45",
    value: null,
    onChange: _.noop
  };

  handleClick = () => {
    const { value, onChange } = this.props;

    UIState.set("prompt", {
      prompt: "icon",
      value,
      onChange
    });
  };

  render() {
    const { className: _className, attr: _attr, icon } = this.props;
    const className = classnames(
      "brz-ed-option__prompt-icon",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} onClick={this.handleClick} {...attr}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}

export default PromptIconOptionType;
