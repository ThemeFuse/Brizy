import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Prompts from "visual/component/Prompts";
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

    Prompts.open({
      prompt: "icon",
      mode: "single",
      props: {
        onChange,
        name: value.name,
        type: value.type,
      }
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
