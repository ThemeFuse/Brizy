import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";

class IntegrationsAppsOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-cog",
    value: {
      service: "facebook",
      group: "social"
    }
  };

  handleMouseDown = event => {
    event.preventDefault();

    Prompts.open({
      prompt: "apps",
      mode: "single",
      props: this.props.value
    });
  };

  render() {
    const { className: _className, attr, icon } = this.props;
    const className = classnames(
      "brz-ed-option__button",
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className} onMouseDown={this.handleMouseDown}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}

export default IntegrationsAppsOptionType;
